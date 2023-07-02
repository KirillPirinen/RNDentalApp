import * as FileSystem from 'expo-file-system';
import { getFileNameWithoutExt, getRootAppDirectory, isFilesExist } from '../../utils/fileHelpers';
import { DEFAULT_DB_NAME, IMPORTED_DB_PATH } from '../../consts';

export const dbExportFilesExt = ['.db', '.db-wal'] as const

export const exportDB = async (dbName: string) => {
  const isRootDB = dbName === DEFAULT_DB_NAME
  const sanitazedUri = getFileNameWithoutExt(dbName, '.db')
  const rootUri = isRootDB ? getRootAppDirectory() : IMPORTED_DB_PATH;
  const dbFilesNames = dbExportFilesExt.map(ext => `${sanitazedUri}${ext}`)

  if (!(await isFilesExist(rootUri, dbFilesNames))) {
    throw new Error(`Не найдены файлы БД ${dbName}.`)
  }
  
  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
      return;
  }

  const dbClonedFiles = await Promise.all(dbFilesNames.map(fileName => FileSystem.readAsStringAsync(`${rootUri}/${fileName}`, { encoding: FileSystem.EncodingType.Base64 })))
      
  await Promise.all(dbClonedFiles.map(async (fileClone, index) => {
    const newDbFile = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, `copy_${dbFilesNames[index]}`, 'application/x-sqlite3')
    await FileSystem.writeAsStringAsync(newDbFile, fileClone, { encoding: FileSystem.EncodingType.Base64 })
  }))

}
