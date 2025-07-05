import { FileToCopy, keepLocalCopy, pick } from '@react-native-documents/picker'
import { useGeneralControl } from '../../context/general-context'
import { t } from '@lingui/core/macro'

export const useFilesPicker = (mimeTypes?: string[]) => {
  const [actions, dispatch] = useGeneralControl()

  const pickFiles = async (createCaches?: boolean) => {
    try {
      const pickerResult = await pick({
        type: mimeTypes,
        presentationStyle: 'fullScreen',
        allowMultiSelection: true
      })

      const localCopyResult = await keepLocalCopy({
        files: pickerResult.map(file => {
          return {
            uri: file.uri,
            fileName: file.name ?? 'fallbackName'
          }
        }) as [FileToCopy, ...FileToCopy[]],
        destination: 'cachesDirectory',
      })

      if (createCaches) {
        pickerResult.forEach((file, index) => {
          // @ts-expect-error
          if (localCopyResult[index]?.localUri) {
          // @ts-expect-error
          file.uri = localCopyResult[index]?.localUri;
          }
        })
      }

      return pickerResult;
    } catch (e) {
      // if(!DocumentPicker.isCancel(e)) {
        dispatch({ 
          type: actions.INFO,
          payload: { 
            text: t`Произошла ошибка. Возможно не все файлы импортированы.`,
            color: 'errorContainer'
          }
        })
      // }
    }
  }

  return pickFiles
}
