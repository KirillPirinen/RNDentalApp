import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { getExtension, makeDirIfNotExist } from '../fileHelpers';
import { createFile } from '../../db/actions/index';
import Patient from '../../db/models/Patient';
import File from '../../db/models/File';
import { mimeTypes } from '../../consts';

type CombinedAssets = {
  uri: string;
  fileName?: string | null;
}

export const resolveFileMeta = (file: CombinedAssets) => {
  const cashUri = file.uri;
  const ext = getExtension(cashUri)
  const name = file.fileName || `${Date.now()}.${ext}`;
  
  return { uri: cashUri, name, ext }
}

export const createAndMove = async (file: CombinedAssets, patient: Patient) => {
  const { uri, name, ext } = resolveFileMeta(file)

  const type = (ext as keyof typeof mimeTypes)

  if(!mimeTypes[type]) return;

  const instance = await createFile({ name, patientId: patient.id, type })
  return await FileSystem.moveAsync({
    from: uri,
    to: instance.uri,
  });
}

export const saveFiles = async (assets: CombinedAssets[], patient: Patient) => {

  await makeDirIfNotExist(patient.filesPath)

  if(!Array.isArray(assets)) {
    return createAndMove(assets, patient)
  }

  return assets.reduce(async (prevPromise, asset) => {
    try {
      await prevPromise
    } catch (err) {
      console.log(err);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return createAndMove(asset, patient);
    }
  }, Promise.resolve())

};

export const deleteFiles = (instances: Array<File> | File) => {

  if(!Array.isArray(instances)) {
    return instances.deleteInstance()
  }

  return instances.reduce(async (prevPromise, instance) => {
    try {
      await prevPromise
    } catch (err) {
      console.log(err);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return instance.deleteInstance()
    }
  }, Promise.resolve())

};

export const usePatientFiles = (patient: Patient) => {
  const [files, setFiles] = useState<Array<File>>([]);
  
  const fetchImgs = async () => {
    const imagesArr = await patient.sortedFiles.fetch()
    imagesArr instanceof Array && setFiles(imagesArr)
  }

  useEffect(() => {
    if(!patient || files.length > 0) return
    fetchImgs()
  }, [patient])

  const addFiles = useCallback(async (assets: CombinedAssets[]) => {
    await saveFiles(assets, patient)
    fetchImgs()
  }, [patient])

  const removeFiles = useCallback(async (instances: Array<File>) => {
    await deleteFiles(instances)
    fetchImgs()
  }, [])

  return { files, addFiles, dirPath: patient.filesPath, removeFiles }
}
