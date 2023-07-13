import type { 
  createAppointmentParams,
  createToothParams,
  createTemplateParams,
  createFileParams,
  createGroupParams
} from './types'
import getDatabase from '..'
import Appointment from '../models/Appointment';
import Tooth from '../models/Tooth';
import Template from '../models/Template';
import File from '../models/File';
import Group from '../models/Group';

export { importPatiensFiles } from './importPatiensFiles'
export { createPatient, importContacts } from './importContacts'
export { exportPatiensFiles } from './exportPatiensFiles'

export const createAppointment = async ({ patientId, date, diagnosis, notes, duration }: createAppointmentParams) => {
  const database = getDatabase()
  return await database.write(async () => await database.get<Appointment>('appointments').create(appointment => {
      appointment.patientId = patientId
      appointment.date = date
      appointment.duration = duration
      appointment.diagnosis = diagnosis || ''
      appointment.notes = notes || ''
    })
  )
}

export const createTooth = async ({ formulaId, toothNo, toothState, notes }: createToothParams) => {
  const database = getDatabase()
  return await database.write(async () => await database.get<Tooth>('teeth').create(tooth => {
      tooth.formulaId = formulaId
      tooth.toothNo = toothNo
      tooth.toothState = toothState
      tooth.notes = notes ?? ''
    })
  )
}

export const createTemplate = async ({ text, name }: createTemplateParams) => {
  const database = getDatabase()
  return await database.write(async () => await database.get<Template>('templates').create(template => {
      template.name = name
      template.text = text
    })
  )
}

export const createFile = async ({ name, type, patientId }: createFileParams) => {
  const database = getDatabase()
  return await database.write(async () => await database.get<File>('files').create(template => {
      template.name = name
      template.type = type
      template.patientId = patientId
    })
  )
}

export const createGroup = async ({ name, description = null, color = null }: createGroupParams, asBatch?: boolean, id?: string) => {
  const database = getDatabase()

  const fn = (group: Group) => {
    group.name = name
    group.description = description
    group.color = color
  }

  if (asBatch) {
    const batchInstance = database.get<Group>('groups').prepareCreate(fn)
    id && (batchInstance._raw.id = id)
    return batchInstance
  }

  return await database.write(async () => await database.get<Group>('groups').create(fn)
  )
}
