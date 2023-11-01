import { Q } from '@nozbe/watermelondb'
import getDatabase from '..'
import * as FileSystem from 'expo-file-system';
import File, { FileMeta } from '../models/File';
import { Manifest } from '../../utils/createManifest';
import { getFileNameFromUri, makeDirIfNotExist } from '../../utils/fileHelpers';
import { t } from '@lingui/macro';
import { ProgressResult } from '../../widgets/Portal/PortalContent/Progress';

export const importPatiensFiles = async () => {
  const database = getDatabase()
  
  const req = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
  
  if (!req.granted) return null

  const dirFiles = await FileSystem.StorageAccessFramework.readDirectoryAsync(req.directoryUri)

  const manifestUri = dirFiles.find(uri => uri.endsWith('manifest.json'))

  if (!manifestUri) throw new Error(t`В папке отсутствует manifest.json`)

  const container: ProgressResult = {
    success: 0,
    fail: 0,
    total: -1, // manifest
    failedValues: []
  }

    const rawUtf8 = await FileSystem.readAsStringAsync(manifestUri)
    const manifest: Manifest<{ filesMeta: Record<string, FileMeta> }> = JSON.parse(rawUtf8)
 
    for (const uri of dirFiles) {
      if(uri === manifestUri) continue;

      const name = getFileNameFromUri(uri)

      if (manifest.data.filesMeta[name]) {

        const meta = manifest.data.filesMeta[name]
        const patientDir = `${FileSystem.documentDirectory}${meta.patientId}/`

        try {
          const fileInstance = (await database.get<File>('files').query(Q.where('id', meta.id)).fetch())[0]

          if (!fileInstance) throw new Error(t`Файла несуществует в БД, нужно импортировать вручную`)
          
          const patientFileMeta = await FileSystem.getInfoAsync(fileInstance.uri)

          if (patientFileMeta.exists) throw new Error(t`Файл с таким именем уже существует, можно импортировать вручную`)

          await makeDirIfNotExist(patientDir)

          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
          await FileSystem.writeAsStringAsync(fileInstance.uri, base64, { encoding: FileSystem.EncodingType.Base64 })

          container.success++

        } catch(e: any) {
          container.failedValues.push({
            name,
            reason: e.message
          })
        } finally {
          container.total++
        }

        continue;
      }

      container.failedValues.push({
        name,
        reason: t`Файл отсутствует в manifest.json`
      })

      container.total++
      
    }

  return container
}
