import * as FileSystem from 'expo-file-system';

let dir: string

export const getRootAppDirectory = () => {
  if (!dir) {
    dir = FileSystem.documentDirectory?.slice(0, -6) ?? ''
  }
  return dir
}

export const getExtension = (str: string) => {
  return str.substring(str.lastIndexOf(".") + 1)
};

export const getFileNameWithoutExt = (str: string, ext?: string) => {
  if (ext) {
    return str.endsWith(ext) ? str.slice(0, -ext.length) : str
  }
  return str.slice(0, str.lastIndexOf(".") + 1)
}

export const getFileNameFromUri = (str: string) => {
  const segments = decodeURIComponent(str).split('/');
  return (segments.pop() || segments.pop() as string); 
}

export const parseFileName = (fileNameJSON: string) => {
  const dotIndex = fileNameJSON.lastIndexOf(".")
  const bareJsonStr = fileNameJSON.substring(0, dotIndex)

  let res
  try {
    res = JSON.parse(bareJsonStr)
  } catch {
    res = { name: bareJsonStr, ext: fileNameJSON.substring(dotIndex + 1)}
  }

  return res
}

export const isFilesExist = async (dir: string, searchFiles: string | string[]) => {
  const rootFiles = await FileSystem.readDirectoryAsync(dir)

  const check = (fileName: string) => rootFiles.includes(fileName)

  return Array.isArray(searchFiles) ? searchFiles.every(check) : check(searchFiles)
}

export const makeDirIfNotExist = async (path: string) => {
  const metaApp = await FileSystem.getInfoAsync(path)

  if(!metaApp.exists) {
    await FileSystem.makeDirectoryAsync(path)
  }
}
