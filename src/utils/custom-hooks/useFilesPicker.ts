import DocumentPicker from 'react-native-document-picker'
import { useGeneralControl } from '../../context/general-context'
import { t } from '@lingui/macro'

export const useFilesPicker = (mimeTypes?: string[]) => {
  const [actions, dispatch] = useGeneralControl()

  const pickFiles = async () => {
    try {
      const pickerResult = await DocumentPicker.pickMultiple({
        type: mimeTypes,
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      })

      return pickerResult

    } catch (e) {
      if(!DocumentPicker.isCancel(e)) {
        dispatch({ 
          type: actions.INFO,
          payload: { 
            text: t`Произошла ошибка. Возможно не все файлы импортированы.`,
            color: 'errorContainer'
          }
        })
      }
    }
  }

  return pickFiles
}
