import React from 'react'
import { ConfirmDelete } from '../Confirm'
import formatRu from '../../utils/formatRu'

const defaultTextsResolvers = {
  patient: ({ patient }) => ({ 
    title: `Удаление пациента ${patient.fullName}.`,
    question: `Вы действительно хотите удалить пациента?\nТакже будет удалена вся информация, касающиеся данного пациента.`
  }),
  appointment: ({ patient, appointment }) => ({
    title:`Удаление записи пациента ${patient.fullName}.`,
    question: `Вы действительно хотите удалить запись на ${formatRu(appointment.date, 'PPpp')}?`
  }),
  template: ({ template }) => ({
    title:`Удаление шаблона ${template.name}.`,
    question: `Вы действительно хотите удалить шаблон?`
  })
}

export const ConfirmDeleteCommon = ({ 
  __visible, 
  __defaultHandlers, 
  mode,
  ...rest 
}) => {
  const defaultProps = defaultTextsResolvers[mode](rest) || {}
  return (
    <ConfirmDelete
      visible={__visible}
      onClose={__defaultHandlers.current.hide}
      {...defaultProps}
      {...rest}
    />
  )
}

