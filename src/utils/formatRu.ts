import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default (date: Date, formatStr: string) => format(date, formatStr, { locale: ru })
