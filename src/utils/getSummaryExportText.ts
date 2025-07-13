import { t, plural } from '@lingui/macro';

export const getSummaryExportText = (fulfilledNum: number, rejectedNum: number) => {
  let res = ''

  if (fulfilledNum) {
    res += `${plural(fulfilledNum, { one: '# файл', few: '# файла', other: '# файлов'})} успешно ${plural(fulfilledNum, { one: 'экспортирован', other: 'экспортировано' })}.`
  }

  if (rejectedNum) {
    const rejText = t`Не удалось экспортировать ${rejectedNum} ${plural(rejectedNum, { one: 'файл', few: 'файла', other: 'файлов' })}.`
    res += res.length ? `\n${rejText}` : rejText
  }

  return res
}
