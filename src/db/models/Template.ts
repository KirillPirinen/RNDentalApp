import { Model } from '@nozbe/watermelondb'
import { text, writer } from '@nozbe/watermelondb/decorators'
import { TAG_REGEX } from '../../consts'
import { defaultUpdater } from '../../utils/defaultFn'

export default class Template extends Model {
  static table = 'templates'
  
  @text('name') name: string
  @text('text') text: string

  get hasTags () {
    return TAG_REGEX.test(this.text)
  }

  @writer async updateInstance(fields: object) {
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

}
