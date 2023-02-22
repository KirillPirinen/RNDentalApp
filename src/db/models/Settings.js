import { Model } from '@nozbe/watermelondb'
import { text, writer, json } from '@nozbe/watermelondb/decorators'

export default class Settings extends Model {
  static table = 'settings'
  
  @text('name') name
  @json('value', (raw) => raw) value

  @writer async updateInstance(value) {
    await this.update(template => {
      template.value = value
    })
  }

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

}
