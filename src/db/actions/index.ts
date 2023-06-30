import { Contact } from 'expo-contacts';
import database from '..'
import { PhoneDTO } from '../../pages/AddPatient';
import { getPatientBatches, getPatientRelationsBatches } from '../utils/batches'
import * as FileSystem from 'expo-file-system';
import Patient from '../models/Patient';
import Appointment from '../models/Appointment';
import Tooth from '../models/Tooth';
import Template from '../models/Template';
import File from '../models/File';
import { ProgressResult } from '../../components/PortalContent/Progress';

export type createPatientParams = {
  phones?: PhoneDTO[]
  phoneNumbers?: Contact['phoneNumbers']
  image?: Contact['image']
  id?: Contact['id']
} & (
  { fullName: string; name?: never; } | { name: string; fullName?: never }
)

export type createPatientOptions = {
  withReturn?: boolean;
}

export const createPatient = async ({ fullName, phones, phoneNumbers, name, id, image }: createPatientParams, { withReturn }: createPatientOptions = {}) => {
  const recievedName = (fullName || name) as string
  const phonesToBatch = phones || phoneNumbers

  if (!withReturn) {
    return await database.write(async () => await database.batch(...getPatientBatches({ 
      fullName: recievedName, 
      phones: phonesToBatch, 
      id,
      image
    })))
  }

  return await database.write(async () => {

    const patient = await database.get<Patient>('patients').create(patient => {
      patient.fullName = recievedName
      patient.hasWhatsapp = true
      patient.hasTelegram = true
      patient.contactId = id ?? null
      patient.avatar = image?.uri ?? null
    })

    await database.batch(...getPatientRelationsBatches({ 
      phones: phonesToBatch, 
      patientId: patient.id 
    }))
    
    return patient
  })

}

export type createAppointmentParams = Pick<Appointment, 'patientId' | 'date' | 'duration'> & { diagnosis?: string; notes?: string; }

export const createAppointment = async ({ patientId, date, diagnosis, notes, duration }: createAppointmentParams) => {
  return await database.write(async () => await database.get<Appointment>('appointments').create(appointment => {
      appointment.patientId = patientId
      appointment.date = date
      appointment.duration = duration
      appointment.diagnosis = diagnosis || ''
      appointment.notes = notes || ''
    })  
  )
}

export type createToothParams = Pick<Tooth, 'formulaId' | 'toothNo' | 'toothState'> & { notes?: string; }

export const createTooth = async ({ formulaId, toothNo, toothState, notes }: createToothParams) => {
  return await database.write(async () => await database.get<Tooth>('teeth').create(tooth => {
      tooth.formulaId = formulaId
      tooth.toothNo = toothNo
      tooth.toothState = toothState
      tooth.notes = notes ?? ''
    })
  )
}

export type createTemplateParams = Pick<Template, 'text' | 'name'>

export const createTemplate = async ({ text, name }: createTemplateParams) => {
  return await database.write(async () => await database.get<Template>('templates').create(template => {
      template.name = name
      template.text = text
    })
  )
}
export type createFileParams = Pick<File, 'name' | 'type' | 'patientId'>

export const createFile = async ({ name, type, patientId }: createFileParams) => {
  return await database.write(async () => await database.get<File>('files').create(template => {
      template.name = name
      template.type = type
      template.patientId = patientId
    })
  )
}

export const exportPatiensFiles = async () => {
  const patients = await database.get<Patient>('patients').query().fetch()
  
  const req = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
  
  if (!req.granted) return null

  const container: ProgressResult = {
    success: 0,
    fail: 0,
    total: 0,
    failedValues: []
  }

  for (let i = 0; i < patients.length; i++) {
    const patient = patients[i]
    const summary = await patient.exportFiles(req.directoryUri)

    if (summary) {
      const { rejected, fulfilled } = summary
      container.total += rejected + fulfilled
      container.success += fulfilled
      container.fail += rejected

      rejected && container.failedValues.push(patient.fullName)
    }
    
  }

  return container
}

export const importContacts = async (choosed: Array<Contact>) => {
  const container: ProgressResult = {
    success: 0,
    fail: 0,
    total: 0,
    failedValues: []
  }

  for (let i = 0; i < choosed.length; i++) {
    const contact = choosed[i]

    try {
      await createPatient(contact)
      container.success++
    } catch(e) {
      container.failedValues.push(contact.name)
    } finally {
      container.total++
    }

  }

  return container
}
