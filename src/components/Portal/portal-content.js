import React from 'react'
import { ConfirmDelete, Confirm } from '../Confirm'
import formatRu from '../../utils/formatRu'
import { Button } from 'react-native-paper'

export const ConfirmDeletePatient = ({ __visible, __defaultHandlers, patient, ...rest }) => (
  <ConfirmDelete
    visible={__visible}
    title={`Удаление ${patient.fullName}`}
    question="Вы действительно хотите удалить пациента?"
    onClose={rest.onClose || __defaultHandlers.current.hide}
    {...rest}
  />
)

export const ConfirmDeleteAppointment = ({ __visible, __defaultHandlers, patient, appointment, ...rest }) => (
  <ConfirmDelete
    visible={__visible}
    title={`Удаление записи пациента ${patient.fullName}`}
    question={`Вы действительно хотите удалить запись на ${formatRu(appointment.date, 'PPpp')}?`}
    onClose={rest.onClose || __defaultHandlers.current.hide}
    {...rest}
  />
)

export const ChooseAddPatientMethod = ({ 
  __visible, 
  __defaultHandlers,
  onAlone,
  onBulk
}) => (
  <Confirm 
    title="Добавить пациента из контактов устройства?" 
    question={`Вы можете добавить несколько пациентов за раз.\nДля этого потребуется Ваше разрешение на чтение данных из контактов устройства.`} 
    visible={__visible}
    onClose={__defaultHandlers.current.hide}
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
