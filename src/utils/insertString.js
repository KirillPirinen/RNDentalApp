
export const replaceStringByIndex = (origStr, tag, start, end) => {
  return `${origStr.slice(0, start)}${tag}${origStr.slice(end)}`
}
