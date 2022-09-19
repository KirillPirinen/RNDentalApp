import { Model } from '@nozbe/watermelondb'
import { text, writer } from '@nozbe/watermelondb/decorators'
import { TAG_REGEX } from '../../utils/constants'
import { defaultUpdater } from '../../utils/defaultFn'

export default class Template extends Model {
  static table = 'templates'
  
  @text('name') name
  @text('text') text

  get hasTags () {
    return TAG_REGEX.test(this.text)
  }

  @writer async updateInstance(fields) {
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

}
