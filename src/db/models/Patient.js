import { Model } from '@nozbe/watermelondb'
import { text, field, writer } from '@nozbe/watermelondb/decorators'

export default class Patient extends Model {
  static table = 'patients'

  @text('first_name') fname
  @text('last_name') lname
  @field('phone') phone

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

export const createPatient = async ({ fname, lname, phone }) => await database.write(
  async () => await database.get('patients').create(patient => {
        patient.fname = fname
        patient.lname = lname
        patient.phone = phone
      })  
  )
