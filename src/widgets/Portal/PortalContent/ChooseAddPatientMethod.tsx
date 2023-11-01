import { FC } from 'react'
import { Confirm } from '../../../components/Confirm'
import { Button } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '..'
import { Trans, t } from '@lingui/macro'

export type ChooseAddPatientMethodProps = ContextedPortalDefaultProps<{
  onAlone: () => void
  onBulk: () => void
}>

export const ChooseAddPatientMethod: FC<ChooseAddPatientMethodProps> = ({ 
  __visible, 
  __defaultProps,
  onAlone,
  onBulk
}) => (
  <Confirm 
    title={t`Добавить пациента из контактов устройства?`} 
    question={t`Вы можете добавить несколько пациентов за раз.\nДля этого потребуется Ваше разрешение на чтение данных из контактов устройства.`} 
    visible={__visible}
    onClose={__defaultProps.hide}
  >
    <Button
      icon="import"
      textColor="black"
      onPress={onBulk}
    > 
      <Trans>Да</Trans> 
    </Button>
    <Button
      icon="cursor-pointer"
      textColor="black"
      onPress={onAlone}
    > 
      <Trans>Ввести данные вручную</Trans>
    </Button>
  </Confirm>
)
