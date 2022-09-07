import { Model } from '@nozbe/watermelondb'
import { text, writer, children } from '@nozbe/watermelondb/decorators'
import { phoneSanitazer } from '../../utils/sanitizers'

export default class Patient extends Model {
  static table = 'patients'

  static associations = {
    appointments: { type: 'has_many', foreignKey: 'patient_id' },
    formulas: { type: 'has_many', foreignKey: 'patient_id' },
    phones: { type: 'has_many', foreignKey: 'patient_id' },
  }
  
  @text('full_name') fullName

  @children('phones') phones
  @children('appointments') appointments
  @children('formulas') formulas

  get separateNames () {
    return this.fullName.split(' ')
  }

  @writer async updateInstance(fields, phones) {

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
      this.prepareUpdate(instance => {
        Object.keys(fields).forEach((key) => {
          instance[key] = fields[key]
        })
      }),
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
