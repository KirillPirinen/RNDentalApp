import type { 
  createPatientParams, 
  createPatientOptions
} from './types'
import { Contact } from 'expo-contacts';
import getDatabase from '..'
import { getPatientBatches, getPatientRelationsBatches } from '../utils/batches'
import Patient from '../models/Patient';
import { ProgressResult } from '../../components/PortalContent/Progress';

export { importPatiensFiles } from './importPatiensFiles'

export const createPatient = async ({ fullName, phones, phoneNumbers, name, id, image }: createPatientParams, { withReturn }: createPatientOptions = {}) => {
  const database = getDatabase()
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
    } catch(e: any) {
      container.failedValues.push({
        name: contact.name,
        reason: e.message
      })
    } finally {
      container.total++
    }

  }

  return container
}
