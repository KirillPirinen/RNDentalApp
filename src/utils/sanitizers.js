
const nonLikeSafeRegexp = /[^a-zA-Z0-9а-я]/g
const nonNum = /[^0-9]/g

export const querySanitazer = (str) => {
  return str.replace(nonLikeSafeRegexp, '')
}

export const phoneSanitazer = (phoneStr) => {
  let sanitazed = phoneStr.replace(nonNum, '')

  const isRU = sanitazed.length === 11

  if(isRU && !sanitazed.startsWith('7')) {
    sanitazed = '7' + sanitazed.slice(1)
  }

  return `+${sanitazed}`
}