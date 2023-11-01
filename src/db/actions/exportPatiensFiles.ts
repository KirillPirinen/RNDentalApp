import getDatabase from '..'
import * as FileSystem from 'expo-file-system';
import Patient from '../models/Patient';
import { FileMeta } from '../models/File';
import { createManifest } from '../../utils/createManifest';
import { ProgressResult } from '../../widgets/Portal/PortalContent/Progress';

export const exportPatiensFiles = async () => {
  const database = getDatabase()
  const patients = await database.get<Patient>('patients').query().fetch()
  
  const req = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

  if (!req.granted) return null

  const container: ProgressResult = {
    success: 0,
    fail: 0,
    total: 0,
    failedValues: []
  }

  const filesMeta: Record<string, FileMeta> = {}

  for (let i = 0; i < patients.length; i++) {
    const patient = patients[i]
    const summary = await patient.exportFiles(req.directoryUri)

    if (summary) {
      const { rejected, fulfilled, result } = summary
      container.total += rejected + fulfilled
      container.success += fulfilled
      container.fail += rejected

      result?.length && fulfilled && result.forEach(item => {
        if (item.status === 'fulfilled') {
          filesMeta[item.value.fileName] = item.value
        }
      })

      rejected && container.failedValues.push({
        name: patient.fullName
      })
    }
    
  }
  
  await createManifest(req.directoryUri, { filesMeta })

  return container
}
