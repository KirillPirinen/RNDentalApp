
export const getExtension = (str) => {
  return str.substring(str.lastIndexOf(".") + 1)
};

export const parseFileName = (fileNameJSON) => {
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
