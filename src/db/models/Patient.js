import { Model } from '@nozbe/watermelondb'
import { text, writer, children, field, lazy } from '@nozbe/watermelondb/decorators'
import { phoneSanitazer } from '../../utils/sanitizers'
import { Q } from '@nozbe/watermelondb'
import { defaultUpdater } from '../../utils/defaultFn'
import * as FileSystem from 'expo-file-system';
import * as Contacts from 'expo-contacts'
import { allSettledWithSummary } from '../../utils/allSettledWithSummary'

export default class Patient extends Model {
  static table = 'patients'

  static associations = {
    appointments: { type: 'has_many', foreignKey: 'patient_id' },
    formulas: { type: 'has_many', foreignKey: 'patient_id' },
    phones: { type: 'has_many', foreignKey: 'patient_id' },
    files: { type: 'has_many', foreignKey: 'patient_id' },
  }
  
  @text('full_name') fullName
  @field('has_telegram') hasTelegram
  @field('has_whatsapp') hasWhatsapp
  @text('contact_id') contactId
  @text('avatar') avatar

  @children('phones') phones
  @children('appointments') appointments
  @children('formulas') formulas
  @children('files') files

  @lazy sortedFiles = this.files.extend(
    Q.sortBy('created_at', Q.desc)
  )

  @lazy teeth = this.collections.get('teeth').query(
    Q.on('formulas', 'patient_id', this.id)
  )

  @lazy sortedAppointments = this.appointments.extend(
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

  @writer async updateInstance(fields, phones) {

    if(!phones || !phones.length) {
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

      return this.collections.get('phones').prepareCreate(instance => {
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
    if(!this.contactId) return;

    const { phoneNumbers, name, image } = await Contacts.getContactByIdAsync(this.contactId)
    
    const existedPhones = (await this.phones.fetch() || []).reduce((acc, phone) => {
      acc[phone.number] = phone
      return acc
    }, {})

    const batches = []

    if (this.fullName !== name || (image?.uri && this.avatar !== image?.uri)) {
      batches.push(this.prepareUpdate(defaultUpdater({ fullName: name, avatar: image?.uri })))
    }

    phoneNumbers?.forEach(contactPhone => {
      const sanitazedPhone = phoneSanitazer(contactPhone.number)
      if(!existedPhones[sanitazedPhone]) {
        batches.push(this.collections.get('phones').prepareCreate(instance => {
          instance.patientId = this.id
          instance.number = sanitazedPhone
        }))
      }
    }, [])

    return batches
  }

  @writer async syncWithContact(batches) {
    const syncBatches = batches ?? await this.getSyncBatches()
    await this.batch(...syncBatches)
  }

  async exportFiles(dir, files) {
    const resFiles = files ?? await this.files.fetch()

    if (resFiles.length === 0) return 

    const { granted, directoryUri } = dir ? { granted: true, directoryUri: dir } : await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (granted) {
      return await allSettledWithSummary(resFiles.map(file => file.copyTo(directoryUri, `${this.fullName}_`)))
    }
  }
}
