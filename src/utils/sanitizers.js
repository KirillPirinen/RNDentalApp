
const nonLikeSafeRegexp = /[^a-zA-Z0-9а-я]/g
const nonNum = /[^0-9\+]/g

export const querySanitazer = (str) => {
  return str.replace(nonLikeSafeRegexp, '')
}

export const phoneSanitazer = (phoneStr) => {
  return phoneStr.replace(nonNum, '')
}
