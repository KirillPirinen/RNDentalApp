import { Model, Query } from '@nozbe/watermelondb'
import { text, writer, children, field, lazy } from '@nozbe/watermelondb/decorators'
import { phoneSanitazer } from '../../utils/sanitizers'
import { Q } from '@nozbe/watermelondb'
import { defaultUpdater } from '../../utils/defaultFn'
import * as FileSystem from 'expo-file-system';
import * as Contacts from 'expo-contacts'
import { allSettledWithSummary } from '../../utils/allSettledWithSummary'
import Phone from './Phone'
import Appointment from './Appointment'
import Formula from './Formula'
import File from './File'
import { PhoneDTO } from '../../pages/AddPatient'
import PatientsGroup from './PatientsGroups'
import Group from './Group'
import Tooth from './Tooth'

export default class Patient extends Model {

  static table = 'patients'

  static associations = {
    appointments: { type: 'has_many', foreignKey: 'patient_id' },
    formulas: { type: 'has_many', foreignKey: 'patient_id' },
    phones: { type: 'has_many', foreignKey: 'patient_id' },
    files: { type: 'has_many', foreignKey: 'patient_id' },
    patients_groups: { type: 'has_many', foreignKey: 'patient_id' },
  } as const
  
  @text('full_name') fullName: string
  @field('has_telegram') hasTelegram: boolean
  @field('has_whatsapp') hasWhatsapp: boolean
  @text('contact_id') contactId: string | null
  @text('avatar') avatar: string | null

  @children('phones') phones: Query<Phone>
  @children('appointments') appointments: Query<Appointment>
  @children('formulas') formulas: Query<Formula>
  @children('files') files: Query<File>
  @children('patients_groups') associatedRecords: Query<PatientsGroup>

  @lazy groups = this.collections.get<Group>('groups')
    .query(Q.on('patients_groups', 'patient_id', this.id))

  // @ts-ignore
  @lazy sortedFiles = this.files.extend(
    Q.sortBy('created_at', Q.desc)
  )

  @lazy teeth = this.collections.get<Tooth>('teeth').query(
    Q.on('formulas', 'patient_id', this.id)
  )

  // @ts-ignore
  @lazy sortedAppointments = this.appointments.extend(
    Q.sortBy('is_archive', Q.asc),
    Q.sortBy('date', Q.desc)
  )

  @lazy nextAppointment = this.sortedAppointments.extend(
    Q.take(1)
  )

  get separateNames () {
    return this.fullName.split(' ')
  }

  get filesPath () {
    return `${FileSystem.documentDirectory}${this.id}/`
  }

  @writer async updateInstance(fields: Record<string, this[keyof this]>, phones?: Array<PhoneDTO>) {

    if (!phones || !phones.length) {
      return await this.update(defaultUpdater(fields))
    }

    const batchPhones = phones.map(dirtyPhone => {

      if(dirtyPhone.delete) {
        return dirtyPhone.link.prepareMarkAsDeleted()
      } else if (dirtyPhone.link) {
        return dirtyPhone.link.prepareUpdate(instance => {
          instance.number = phoneSanitazer(dirtyPhone.number)
        })
      }

      return this.collections.get<Phone>('phones').prepareCreate(instance => {
        instance.patientId = this.id
        instance.number = phoneSanitazer(dirtyPhone.number)
      })
    })

    await this.batch(
      this.prepareUpdate(defaultUpdater(fields)),
      ...batchPhones
    ) 
  }

  @writer async deleteInstance() {
    await this.appointments.destroyAllPermanently()
    await this.formulas.destroyAllPermanently()
    await this.phones.destroyAllPermanently()
    return await this.markAsDeleted()
  }

  async getSyncBatches() {
    const batches: Array<Patient | Phone> = []

    if(!this.contactId) return batches;

    const { phoneNumbers, name, image } = (await Contacts.getContactByIdAsync(this.contactId) as Contacts.Contact | Record<string, never> ?? {})
    
    const existedPhones = (await this.phones.fetch() || []).reduce<Record<string, Phone>>((acc, phone) => {
      acc[phone.number] = phone
      return acc
    }, {})

    if (this.fullName !== name || (image?.uri && this.avatar !== image?.uri)) {
      batches.push(this.prepareUpdate(defaultUpdater({ fullName: name, avatar: image?.uri })))
    }

    phoneNumbers?.forEach(contactPhone => {
      const sanitazedPhone = phoneSanitazer(contactPhone.number!)
      if(!existedPhones[sanitazedPhone]) {
        batches.push(this.collections.get<Phone>('phones').prepareCreate(instance => {
          instance.patientId = this.id
          instance.number = sanitazedPhone
        }))
      }
    }, [])

    return batches
  }

  @writer async syncWithContact(batches: Array<Model>) {
    const syncBatches = batches ?? await this.getSyncBatches()
    await this.batch(...syncBatches)
  }

  async exportFiles(dir?: string, files?: Array<File>) {
    const resFiles = files ?? await this.files.fetch()

    if (resFiles.length === 0) return 

    // @ts-ignore
    const { granted, directoryUri } = dir ? { granted: true, directoryUri: dir } : await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (granted) {
      return await allSettledWithSummary(resFiles.map(file => file.copyTo(directoryUri, `${this.fullName}_`)))
    }
  }
}
