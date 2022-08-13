import { Model } from '@nozbe/watermelondb'
import { text, field, writer, children } from '@nozbe/watermelondb/decorators'

export default class Patient extends Model {
  static table = 'patients'

  static associations = {
    appointments: { type: 'has_many', foreignKey: 'patient_id' },
  }
  
  @text('first_name') fname
  @text('last_name') lname
  @field('phone') phone

  @children('appointments') appointments

  get fullName() {
    return `${this.fname} ${this.lname}`
  }

  @writer async updateInstance(fields) {
    await this.update(instance => {
        Object.keys(fields).forEach((key) => {
          instance[key] = fields[key]
        })
    })
  }

  @writer async deleteInstance() {
    await this.appointments.destroyAllPermanently()
    return await this.markAsDeleted()
  }

}
