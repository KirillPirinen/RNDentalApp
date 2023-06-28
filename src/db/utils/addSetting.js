import { unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations/index'
import { DEFAULT_SETTINGS } from '../../consts/index'
import { insertSettings } from '../raw-queries'

export const addSetting = (settingName) => {
  if (!DEFAULT_SETTINGS[settingName]) {
    return console.log('Setting with name: ', settingName, ' not found')
  }
  return unsafeExecuteSql(insertSettings({ [settingName]: DEFAULT_SETTINGS[settingName] }))
}
