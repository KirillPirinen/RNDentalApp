import AsyncStorage from "@react-native-async-storage/async-storage"
import { APP_DATA_DIR, DEFAULT_DB_NAME, IMPORTED_DB_PATH } from "."
import { makeDirIfNotExist } from "../utils/fileHelpers"
import { locale as deviceLocaleName } from 'expo-localization'
import enMesages from '../locales/en/messages.js'
import ruMesages from '../locales/ru/messages.js'
import esMesages from '../locales/es/messages.js'
import zhMesages from '../locales/zh/messages.js'
import deMesages from '../locales/de/messages.js'
import frMesages from '../locales/fr/messages.js'
import hiMesages from '../locales/hi/messages.js'

export type AppLocales = keyof typeof appMessages

export const appMessages = {
  en: enMesages.messages,
  ru: ruMesages.messages,
  es: esMesages.messages,
  zh: zhMesages.messages,
  de: deMesages.messages,
  fr: frMesages.messages,
  hi: hiMesages.messages
} as const

export const fallback_locale = 'en'

const isALlowedAppLocale = (s: string): s is AppLocales => s in appMessages

const getDeviceLocaleName = (): AppLocales => {
  if (!deviceLocaleName) return fallback_locale

  const prepearedLocale = deviceLocaleName.length === 2 ? deviceLocaleName : deviceLocaleName.slice(0, 2)

  if (isALlowedAppLocale(prepearedLocale)) {
    return prepearedLocale
  } 

  return fallback_locale
}

export const appConfigSync = {
  dbName: DEFAULT_DB_NAME,
  dbPath: DEFAULT_DB_NAME,
  lang: getDeviceLocaleName()
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
    const lang = await AsyncStorage.getItem('lang')
    const isImportedDB = asyncName && asyncName !== DEFAULT_DB_NAME

    if (isImportedDB) {
      appConfigSync.dbName = asyncName
      appConfigSync.dbPath = `${IMPORTED_DB_PATH}/${asyncName}.db`
    }

    if (lang && isALlowedAppLocale(lang)) {
      appConfigSync.lang = lang as AppLocales
    }

    return appConfigSync
    
  } catch (e) {
    console.log(e)
  }

  return appConfigSync
})()
