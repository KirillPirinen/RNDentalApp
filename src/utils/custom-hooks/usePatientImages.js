import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { getExtension } from '../getFileExtentsion';

export const getPatientDir = (patientId) => `${FileSystem.documentDirectory}${patientId}/`

export const saveImages = (assets, dirPath) => {

  const moveFile = async (file) => {
    const fileName = `${Date.now()}.${getExtension(file.uri)}`;
    return await FileSystem.moveAsync({
      from: file.uri,
      to: `${dirPath}${fileName}`,
    });
  }

  if(!Array.isArray(assets)) {
    return moveFile(assets)
  }

  return assets.reduce(async (prevPromise, asset, i, array) => {
    try {
      await prevPromise
    } catch (err) {
      console.log(err);
    } finally {
      const fileName = `${Date.now()}.${getExtension(asset.uri)}`;
      return FileSystem.moveAsync({ from: asset.uri, to: `${dirPath}${fileName}` });
    }
  }, Promise.resolve())

};


export const usePatientImages = (patient) => {
  const [images, setImages] = useState([]);

  const dirPath = patient?.id && getPatientDir(patient.id)

  const fetchImgs = async (path) => {
    const imagesArr = await FileSystem.readDirectoryAsync(path)
    imagesArr instanceof Array && setImages(imagesArr)
  }
  
  useEffect(() => {
    if(!dirPath || images.length > 0) return

   (async () => {
     const meta = await FileSystem.getInfoAsync(dirPath) 
     if(meta.exists) {
      await fetchImgs(dirPath)
     } else {
      await FileSystem.makeDirectoryAsync(dirPath)
     } 
   })()

  }, [dirPath])

  const addImages = useCallback(async (assets) => {
    await saveImages(assets, dirPath)
    fetchImgs(dirPath)
  }, [dirPath])

  return { images, addImages, dirPath }
}
