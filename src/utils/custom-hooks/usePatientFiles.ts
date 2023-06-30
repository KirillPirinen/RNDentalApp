import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { getExtension } from '../fileHelpers';
import { createFile } from '../../db/actions/index';
import Patient from '../../db/models/Patient';
import File from '../../db/models/File';
import { ImagePickerAsset } from 'expo-image-picker';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { mimeTypes } from '../../consts';

type CombinedAssets = ImagePickerAsset | DocumentPickerResponse

export const resolveFileMeta = (file: CombinedAssets) => {
  const cashUri = (file as DocumentPickerResponse).fileCopyUri || file.uri
  const name = (file as DocumentPickerResponse)?.name || (file as ImagePickerAsset)?.fileName
  const ext = getExtension(cashUri)
  
  return { uri: cashUri, name: name || `${Date.now()}.${ext}`, ext }
}

export const saveFiles = async (assets: CombinedAssets[], patient: Patient) => {

  const meta = await FileSystem.getInfoAsync(patient.filesPath) 

  if(!meta.exists) {
    await FileSystem.makeDirectoryAsync(patient.filesPath)
  }

  const moveFile = async (file: CombinedAssets) => {
    const { uri, name, ext } = resolveFileMeta(file)

    const type = (ext as keyof typeof mimeTypes)

    if(!mimeTypes[type]) return;

    const instance = await createFile({ name, patientId: patient.id, type })
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
      // eslint-disable-next-line no-unsafe-finally
      return moveFile(asset);
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
