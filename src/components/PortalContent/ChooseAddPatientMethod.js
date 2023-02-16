import { Confirm } from '../Confirm'
import { Button } from 'react-native-paper'

export const ChooseAddPatientMethod = ({ 
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
      size={30}
      onPress={onBulk}
    > 
      Да 
    </Button>
    <Button
      icon="cursor-pointer"
      textColor="black"
      size={30}
      onPress={onAlone}
    > 
      Ввести данные вручную
    </Button>
  </Confirm>
)
