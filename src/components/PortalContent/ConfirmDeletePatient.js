import React from 'react'
import { ConfirmDelete } from '../Confirm'

export const ConfirmDeletePatient = ({ __visible, __defaultHandlers, patient, ...rest }) => (
  <ConfirmDelete
    visible={__visible}
    title={`Удаление ${patient.fullName}`}
    question="Вы действительно хотите удалить пациента?"
    onClose={rest.onClose || __defaultHandlers.current.hide}
    {...rest}
  />
)
