import AsyncStorage from "@react-native-async-storage/async-storage"
import { APP_DATA_DIR, DEFAULT_DB_NAME, IMPORTED_DB_PATH } from "."
import { makeDirIfNotExist } from "../utils/fileHelpers"

export const appConfigSync = {
  dbName: DEFAULT_DB_NAME,
  dbPath: DEFAULT_DB_NAME
}

const initApp = async () => {
  try {
    await makeDirIfNotExist(APP_DATA_DIR)
  } catch (e) {
    console.log(e)
  }
}

export const appConfigAsync = (async () => {
  await initApp();
  try {
    const asyncName = await AsyncStorage.getItem('dbName')
    const isImportedDB = asyncName && asyncName !== DEFAULT_DB_NAME
    if (isImportedDB) {
      appConfigSync.dbName = asyncName
      appConfigSync.dbPath = `${IMPORTED_DB_PATH}/${asyncName}.db`
    }
  } catch (e) {
    console.log(e)
  }

  return appConfigSync
})()
