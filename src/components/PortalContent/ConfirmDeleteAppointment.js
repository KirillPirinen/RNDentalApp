import React from 'react'
import { ConfirmDelete } from '../Confirm'
import formatRu from '../../utils/formatRu'

export const ConfirmDeleteAppointment = ({ __visible, __defaultHandlers, patient, appointment, ...rest }) => (
  <ConfirmDelete
    visible={__visible}
    title={`Удаление записи пациента ${patient.fullName}`}
    question={`Вы действительно хотите удалить запись на ${formatRu(appointment.date, 'PPpp')}?`}
    onClose={rest.onClose || __defaultHandlers.current.hide}
    {...rest}
  />
)

