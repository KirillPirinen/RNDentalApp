import * as FileSystem from 'expo-file-system';
import { appConfigSync } from '../../consts/config';
import { getFileNameWithoutExt } from '../../utils/fileHelpers';
import { IMPORTED_DB_PATH } from '../../consts';
import { t } from '@lingui/core/macro';

export const dbDeleteFilesExt = ['.db', '.db-wal', '.db-shm'] as const

export const deleteDB = async (dbName: string) => {
  if (appConfigSync.dbName === dbName) {
    throw new Error(t`Нельзя удалить смонтированную БД`)
  }

  const sanitazedUri = getFileNameWithoutExt(dbName, '.db')
  const dbFilesUris = dbDeleteFilesExt.map(ext => `${IMPORTED_DB_PATH}/${sanitazedUri}${ext}`)

  await Promise.all(dbFilesUris.map((uri) => FileSystem.deleteAsync(uri).catch(console.log)))
}
