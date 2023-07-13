import React from 'react'
import { ConfirmDelete } from '../../../components/Confirm'
import formatRu from '../../../utils/formatRu'
import { ContextedPortalDefaultProps } from '..'
import Patient from '../../../db/models/Patient'
import Appointment from '../../../db/models/Appointment'
import Template from '../../../db/models/Template'
import Group from '../../../db/models/Group'

export type ConfirmDeleteCommonModes = keyof typeof defaultTextsResolvers

const defaultTextsResolvers = {
  patient: ({ patient }: { patient: Patient }) => ({ 
    title: `Удаление пациента ${patient.fullName}.`,
    question: `Вы действительно хотите удалить пациента?\nТакже будет удалена вся информация, касающиеся данного пациента.`
  }),
  appointment: ({ patient, appointment }: { patient: Patient; appointment: Appointment }) => ({
    title:`Удаление записи пациента ${patient.fullName}.`,
    question: `Вы действительно хотите удалить запись на ${formatRu(appointment.date, 'PPpp')}?`
  }),
  template: ({ template }: { template: Template }) => ({
    title:`Удаление шаблона ${template.name}.`,
    question: `Вы действительно хотите удалить шаблон?`
  }),
  database: ({ dbName }: { dbName: string }) => ({
    title:`Удаление БД ${dbName}.`,
    question: `Вы действительно хотите удалить БД без возможности восстановления?`
  }),
  group: ({ group }: { group: Group }) => ({
    title:`Удаление группы ${group.name}.`,
    question: `Вы действительно хотите группу ${group.name}? Пациенты будут исключены из нее.`
  })
}

type Resolvers = typeof defaultTextsResolvers

type DefaultCompProps = Omit<React.ComponentProps<typeof ConfirmDelete> , 'visible' | 'title' | 'question' | 'onClose'| 'children'>

type SelectAdditional<T extends ConfirmDeleteCommonModes> = 
  T extends "patient" ? Parameters<Resolvers['patient']>[0] :
  T extends "appointment" ? Parameters<Resolvers['appointment']>[0] :
  T extends "template" ? Parameters<Resolvers['template']>[0] :
  T extends "group" ? Parameters<Resolvers['group']>[0] :
  never

export type ConfirmDeleteCommonProps<T extends ConfirmDeleteCommonModes> = DefaultCompProps & ContextedPortalDefaultProps<{
  mode: T;
  patient?: Patient;
  appointment?: Appointment;
  template?: Template;
  dbName?: string;
  group?: Group;
}> & SelectAdditional<T>

export const ConfirmDeleteCommon = <T extends ConfirmDeleteCommonModes>({ 
  __visible, 
  __defaultProps, 
  mode,
  ...rest 
}: ConfirmDeleteCommonProps<T>) => {
   
  // @ts-ignore
  const defaultProps = defaultTextsResolvers[mode](rest) || {}
  return (
    // @ts-ignore
    <ConfirmDelete
      visible={__visible}
      onClose={__defaultProps.clear}
      {...defaultProps}
      {...rest}
    />
  )
}

