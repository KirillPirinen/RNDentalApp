import React from 'react'
import { ConfirmDelete } from '../../../components/Confirm'
import formatRu from '../../../utils/formatLocalized'
import { ContextedPortalDefaultProps } from '..'
import Patient from '../../../db/models/Patient'
import Appointment from '../../../db/models/Appointment'
import Template from '../../../db/models/Template'
import Group from '../../../db/models/Group'
import { t } from '@lingui/core/macro'

export type ConfirmDeleteCommonModes = keyof typeof defaultTextsResolvers

const defaultTextsResolvers = {
  patient: ({ patient }: { patient: Patient }) => ({ 
    title: t`Удаление пациента ${patient.fullName}.`,
    question: t`Вы действительно хотите удалить пациента?\nТакже будет удалена вся информация, касающиеся данного пациента.`
  }),
  appointment: ({ patient, appointment }: { patient: Patient; appointment: Appointment }) => ({
    title: t`Удаление записи пациента ${patient.fullName}.`,
    question: t`Вы действительно хотите удалить запись на ${formatRu(appointment.date, 'PPpp')}?`
  }),
  template: ({ template }: { template: Template }) => ({
    title: t`Удаление шаблона ${template.name}.`,
    question: t`Вы действительно хотите удалить шаблон?`
  }),
  database: ({ dbName }: { dbName: string }) => ({
    title: t`Удаление БД ${dbName}.`,
    question: t`Вы действительно хотите удалить БД без возможности восстановления?`
  }),
  group: ({ group }: { group: Group }) => ({
    title: t`Удаление группы ${group.name}.`,
    question: t`Вы действительно хотите группу ${group.name}? Пациенты будут исключены из нее.`
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

