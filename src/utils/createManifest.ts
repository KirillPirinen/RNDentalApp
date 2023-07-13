import * as FileSystem from 'expo-file-system';

export type Manifest<T extends object> = {
  version: number,
  data: T
}

export const getDefaultManifest = <T extends object>(content: T): Manifest<T> => ({
  version: 1,
  data: {
    ...content
  }
})

export const createManifest = async (targetUrl: string, content: object, name = 'manifest.json') => {
  const newFileUrl = await FileSystem.StorageAccessFramework.createFileAsync(targetUrl, name, 'application/json');
  await FileSystem.writeAsStringAsync(newFileUrl, JSON.stringify(getDefaultManifest(content)))
  return newFileUrl
}
