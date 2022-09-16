import { Model } from '@nozbe/watermelondb'
import { text, writer } from '@nozbe/watermelondb/decorators'

export default class Template extends Model {
  static table = 'templates'
  
  @text('name') name
  @text('text') text

  @writer async updateInstance(fields) {
    await this.update(instance => {
        Object.keys(fields).forEach((key) => {
          instance[key] = fields[key]
        })
    })
  }

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

}
