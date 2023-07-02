import * as FileSystem from 'expo-file-system';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { IMPORTED_DB_PATH } from '../../consts';
import { getFileNameFromUri, getFileNameWithoutExt, makeDirIfNotExist } from '../../utils/fileHelpers';

export const dbExportFilesExt = ['.db', '.db-wal'] as const

type Tuple = [DocumentPickerResponse, DocumentPickerResponse]
const validateFiles = (files: DocumentPickerResponse[]): Tuple => {

  const filtered = files.filter(file => dbExportFilesExt.some((ext) => file.uri.endsWith(ext)))

  if(!(filtered.length === 2)) {
    throw new Error(`Не выбраны файлы с расширениями: ${dbExportFilesExt.toString()}`)
  }

  const filename1 = getFileNameWithoutExt(filtered[0].name || getFileNameFromUri(filtered[0].uri))
  const filename2 = getFileNameWithoutExt(filtered[1].name || getFileNameFromUri(filtered[1].uri))

  if (filename1 !== filename2) {
    throw new Error(`Выбранные файлы принадлежат разным БД.`)
  }

  return filtered as Tuple
}

export const importDB = async (files: DocumentPickerResponse[]) => {
  const tupleFiles = validateFiles(files)

  await makeDirIfNotExist(IMPORTED_DB_PATH)

  await Promise.all(tupleFiles.map(file => {
    return FileSystem.copyAsync({
      from: file.uri,
      to: IMPORTED_DB_PATH,
    })
  }));

}
