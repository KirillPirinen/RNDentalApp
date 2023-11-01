
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'

const nonLikeSafeRegexp = /[^a-zA-Z0-9а-яА-Я]/g
const nonNum = /[^0-9]/g

export const querySanitazer = (str: string) => {
  return str.replace(nonLikeSafeRegexp, '')
}

const tryCountry = ["RU", "CN", "DE", "ES", "FR", "IN", "GB", "US"] as const

export const phoneSanitazer = (phoneStr: string) => {
  const sanitazed = phoneStr.replace(nonNum, '')

  for (const countryCode of tryCountry) {
    const parsed = isValidPhoneNumber(sanitazed, countryCode) && parsePhoneNumber(sanitazed, countryCode)
    
    if (parsed) {
      return parsed.number
    }
  }

  return sanitazed
}
