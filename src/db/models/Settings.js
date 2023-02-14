import { Model } from '@nozbe/watermelondb'
import { text, writer, lazy, children, field, json } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'
import { Q } from '@nozbe/watermelondb'

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
