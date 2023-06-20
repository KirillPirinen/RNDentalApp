import { View, StyleSheet } from 'react-native'
import { Confirm } from '../Confirm'
import { Button as PaperButton, Checkbox, Dialog } from 'react-native-paper'
import { withSetting } from '../../utils/hoc/withSetting.js'

export const ChooseSync = withSetting('sync')(({ 
  __visible, 
  __defaultProps,
  onSync,
  setting
}) => {

  return (
      <Confirm 
        visible={__visible} 
        title={'Обнаружены изменения в контакте.'}
        question={'Хотите провести синхронизацию?'}
        onClose={__defaultProps.clear}
      >
        <View>
          <Checkbox.Item label="Больше не спрашивать" status="checked" />
          <Dialog.Actions>
            <PaperButton
              icon="sync"
              textColor="black"
              size={30}
              onPress={onSync}
            >
              Да
            </PaperButton>
            <PaperButton
              icon="window-close"
              textColor="black"
              size={30}
              onPress={__defaultProps.clear}
            >
              Нет
            </PaperButton>
          </Dialog.Actions>
        </View>
      </Confirm>
  )
})

const styles = StyleSheet.create({
  buttonContainer: {

  }
})
