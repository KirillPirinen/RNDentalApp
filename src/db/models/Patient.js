import { Model } from '@nozbe/watermelondb'
import { text, writer } from '@nozbe/watermelondb/decorators'

export default class Patient extends Model {
  static table = 'patients'

  @text('first_name') fname
  @text('last_name') lname

  @writer async addNew(data) {
    return await this.collections.get('patients').create(patient => {
      patient.fname = data.fname
      patient.lname = data.lname
    })
  }
}
