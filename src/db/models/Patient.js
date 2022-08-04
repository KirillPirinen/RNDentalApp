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
}
