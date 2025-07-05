import { View } from 'react-native'
import { Confirm } from '../../../components/Confirm'
import { Button as PaperButton, Checkbox, Dialog } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '..'
import { FC } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'

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
        title={t`Обнаружены изменения в контакте.`}
        question={t`Хотите провести синхронизацию?`}
        onClose={__defaultProps.clear}
      >
        <View>
          <Checkbox.Item label={t`Больше не спрашивать`} status="checked" />
          <Dialog.Actions>
            <PaperButton
              icon="sync"
              textColor="black"
              onPress={onSync}
            >
              <Trans>Да</Trans>
            </PaperButton>
            <PaperButton
              icon="window-close"
              textColor="black"
              onPress={__defaultProps.clear}
            >
              <Trans>Нет</Trans>
            </PaperButton>
          </Dialog.Actions>
        </View>
      </Confirm>
  )
}
