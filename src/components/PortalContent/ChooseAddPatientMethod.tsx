import { FC } from 'react'
import { Confirm } from '../Confirm'
import { Button } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '../__components__/__Portal'

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
    title="Добавить пациента из контактов устройства?" 
    question={`Вы можете добавить несколько пациентов за раз.\nДля этого потребуется Ваше разрешение на чтение данных из контактов устройства.`} 
    visible={__visible}
    onClose={__defaultProps.hide}
  >
    <Button
      icon="import"
      textColor="black"
      onPress={onBulk}
    > 
      Да 
    </Button>
    <Button
      icon="cursor-pointer"
      textColor="black"
      onPress={onAlone}
    > 
      Ввести данные вручную
    </Button>
  </Confirm>
)
