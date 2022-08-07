import { Model } from '@nozbe/watermelondb'
import { text, field, writer, relation, children } from '@nozbe/watermelondb/decorators'
import { Q } from '@nozbe/watermelondb';

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
    await this.update(patient => {
        Object.keys(fields).forEach((key) => {
          patient[key] = fields[key]
        })
    })
  }

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

}
