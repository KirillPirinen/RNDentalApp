
export const replaceStringByIndex = (origStr: string, tag:string, start:number, end:number) => {
  return `${origStr.slice(0, start)}${tag}${origStr.slice(end)}`
}
