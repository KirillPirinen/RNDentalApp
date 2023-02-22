import { Model } from '@nozbe/watermelondb'
import { text, writer, children, field, lazy } from '@nozbe/watermelondb/decorators'
import { phoneSanitazer } from '../../utils/sanitizers'
import { Q } from '@nozbe/watermelondb'
import { defaultUpdater } from '../../utils/defaultFn'
import * as FileSystem from 'expo-file-system';

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

    if(!phones) {
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

}
