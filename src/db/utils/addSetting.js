import { unsafeExecuteSql } from "@nozbe/watermelondb/Schema/migrations/index.js";
import { DEFAULT_SETTINGS } from "../../consts/index.js"
import { insertSettings } from "../raw-queries.js";

export const addSetting = (settingName) => {
  if(!DEFAULT_SETTINGS[settingName]) {
    return console.log('Setting with name: ', settingName, ' not found')
  };
  return unsafeExecuteSql(insertSettings({ [settingName]: DEFAULT_SETTINGS[settingName] }))
} 
