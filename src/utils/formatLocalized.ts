import format from 'date-fns/format'
import ru from 'date-fns/locale/ru'
import en from 'date-fns/locale/en-US'
import zh from 'date-fns/locale/zh-CN'
import es from 'date-fns/locale/es'
import de from 'date-fns/locale/de'
import fr from 'date-fns/locale/fr'
import hi from 'date-fns/locale/hi'
import { i18n } from "@lingui/core"
import { AppLocales } from '../consts/config'

const appLocales = {
  ru,
  en,
  zh,
  es,
  de,
  fr,
  hi
} as const

export default (date: Date, formatStr: string) => format(date, formatStr, {
  locale: i18n.locale in appLocales ? appLocales[i18n.locale as AppLocales] : en 
})

const formattedWithAsciiSpace = new Intl.NumberFormat('ru-RU', {
  style: 'decimal',
  maximumFractionDigits: 0
})

export const formatPrice = formattedWithAsciiSpace.format;
