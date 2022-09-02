import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default (date, formatStr) => format(date, formatStr, { locale: ru })
