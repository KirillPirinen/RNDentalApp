import { View } from 'react-native'
import { Confirm } from '../Confirm'
import { Button as PaperButton, Checkbox, Dialog } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '../__components__/__Portal'
import { FC } from 'react'

export type ChooseSyncProps = ContextedPortalDefaultProps<{
  onSync: () => void
}>

export const ChooseSync: FC<ChooseSyncProps> = ({ 
  __visible, 
  __defaultProps,
  onSync,
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
              onPress={onSync}
            >
              Да
            </PaperButton>
            <PaperButton
              icon="window-close"
              textColor="black"
              onPress={__defaultProps.clear}
            >
              Нет
            </PaperButton>
          </Dialog.Actions>
        </View>
      </Confirm>
  )
}
