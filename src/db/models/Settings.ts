import { Model } from '@nozbe/watermelondb'
import { text, writer, json } from '@nozbe/watermelondb/decorators'
import { AllowedSettings } from '../../consts'

export type NamedSetting<T extends keyof AllowedSettings> = Pick<Settings, 'updateInstance'> & {
  name: T
  value: AllowedSettings[T]
}

export default class Settings extends Model {
  static table = 'settings'

  @text('name') name: keyof AllowedSettings
  @json('value', (raw) => raw) value: AllowedSettings[keyof AllowedSettings]

  @writer async updateInstance (value: typeof this.value) {
    await this.update(template => {
      template.value = value
    })
  }

  @writer async deleteInstance () {
    return await this.markAsDeleted()
  }
}
