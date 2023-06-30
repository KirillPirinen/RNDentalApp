import { Contact } from 'expo-contacts';
import database from '..'
import { phoneSanitazer } from '../../utils/sanitizers'
import Patient from '../models/Patient';
import Phone from '../models/Phone';
import Formula from '../models/Formula';

export type getPatientBatchesParams = {
  phones?: Partial<Pick<Phone, 'number' | 'isPrimary'>>[]
  fullName: string;
  id?: string;
  image: Contact['image']
}

export const getPatientBatches = ({ phones, fullName, id, image }: getPatientBatchesParams) => {
  let patientId: string

  const patientBatch = database.get<Patient>('patients').prepareCreate(patient => {
    patient.fullName = fullName
    patient.hasWhatsapp = true
    patient.hasTelegram = true
    patient.contactId = id ?? null

    if (image?.uri) {
      patient.avatar = image.uri
    }

    patientId = patient.id
  })

  return [
    patientBatch,
     
    // @ts-ignore
    ...(getPatientRelationsBatches({ phones, patientId }))
  ]
}

export type getPatientRelationsBatchesParams = { 
  patientId: string;
  phones?: getPatientBatchesParams['phones'] 
}

export const getPatientRelationsBatches = ({ patientId, phones }: getPatientRelationsBatchesParams) => {
  return [
    database.get<Formula>('formulas').prepareCreate(formula => {
      formula.patientId = patientId
      formula.hasAdultJaw = true
      formula.hasBabyJaw = false
    }),
    ...(phones?.filter(phone => Boolean(phone.number)).map(phone => database.get<Phone>('phones').prepareCreate(instance => {
      instance.patientId = patientId
      instance.number = phoneSanitazer(phone.number)
      instance.isPrimary = Boolean(phone.isPrimary)
    })) || [])
  ]
}
