import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { getExtension } from '../fileHelpers';
import { createFile } from '../../db/actions/index';

export const resolveFileMeta = (file) => {
  const cashUri = file.fileCopyUri || file.uri
  const date = Date.now()
  const ext = getExtension(cashUri)
  
  return { uri: cashUri, name: file?.name || `${date}.${ext}`, ext }
}

export const saveFiles = async (assets, patient) => {

  const meta = await FileSystem.getInfoAsync(patient.filesPath) 

  if(!meta.exists) {
    await FileSystem.makeDirectoryAsync(patient.filesPath)
  }

  const moveFile = async (file) => {
    const { uri, name, ext } = resolveFileMeta(file)
    const instance = await createFile({ name, patientId: patient.id, type: ext })
    return await FileSystem.moveAsync({
      from: uri,
      to: instance.uri,
    });
  }

  if(!Array.isArray(assets)) {
    return moveFile(assets)
  }

  return assets.reduce(async (prevPromise, asset) => {
    try {
      await prevPromise
    } catch (err) {
      console.log(err);
    } finally {
      return moveFile(asset);
    }
  }, Promise.resolve())

};

export const deleteFiles = (instances) => {

  if(!Array.isArray(instances)) {
    return instances.deleteInstance()
  }

  return instances.reduce(async (prevPromise, instance) => {
    try {
      await prevPromise
    } catch (err) {
      console.log(err);
    } finally {
      return instance.deleteInstance()
    }
  }, Promise.resolve())

};

export const usePatientFiles = (patient) => {
  const [files, setFiles] = useState([]);
  
  const fetchImgs = async () => {
    const imagesArr = await patient.sortedFiles.fetch()
    imagesArr instanceof Array && setFiles(imagesArr)
  }

  useEffect(() => {
    if(!patient || files.length > 0) return
    fetchImgs()
  }, [patient])

  const addFiles = useCallback(async (assets) => {
    await saveFiles(assets, patient)
    fetchImgs()
  }, [patient])

  const removeFiles = useCallback(async (instances) => {
    await deleteFiles(instances)
    fetchImgs()
  }, [])

  return { files, addFiles, dirPath: patient.filesPath, removeFiles }
}
