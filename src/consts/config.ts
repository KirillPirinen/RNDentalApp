import AsyncStorage from "@react-native-async-storage/async-storage"
import { APP_DATA_DIR, DEFAULT_DB_NAME, IMPORTED_DB_PATH } from "."
import { makeDirIfNotExist } from "../utils/fileHelpers"
import { locale as deviceLocaleName } from 'expo-localization'
import enMesages from '../locales/en/messages.json'
import ruMesages from '../locales/ru/messages.json'
import esMesages from '../locales/es/messages.json'
import zhMesages from '../locales/zh/messages.json'
import deMesages from '../locales/de/messages.json'
import frMesages from '../locales/fr/messages.json'
import hiMesages from '../locales/hi/messages.json'

export type AppLocales = keyof typeof appMessages

export const appMessages = {
  en: enMesages,
  ru: ruMesages,
  es: esMesages,
  zh: zhMesages,
  de: deMesages,
  fr: frMesages,
  hi: hiMesages
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
