import plural from 'plural-ru';

export const getSummaryExportText = (fulfilledNum, rejectedNum) => {
  let res = ''

  if (fulfilledNum) {
    res += `${fulfilledNum} ${plural(fulfilledNum, 'файл', 'файла', 'файлов')} успешно ${plural(fulfilledNum, 'экспортирован', 'экспортировано')}.`
  }

  if (rejectedNum) {
    const rejText = `Не удалось экспортировать ${rejectedNum} ${plural(rejectedNum, 'файл', 'файла', 'файлов')}.`
    res += res.length ? `\n${rejText}` : rejText
  }

  return res
}
