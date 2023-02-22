import database from '..'
import { phoneSanitazer } from '../../utils/sanitizers'

export const getPatientBatches = ({ phones, fullName, id }) => {

  let patientId

  return [
    database.get('patients').prepareCreate(patient => {
      patient.fullName = fullName
      patient.hasWhatsapp = true
      patient.hasTelegram = true
      patient.contactId = id

      patientId = patient.id
    }),
    ...getPatientRelationsBatches({ phones, patientId })
  ]

}

export const getPatientRelationsBatches = ({ patientId, phones }) => {
  return [
    database.get('formulas').prepareCreate(formula => {
      formula.patientId = patientId
      formula.hasAdultJaw = true
      formula.hasBabyJaw = false
    }),
    ...(phones?.map(phone => database.get('phones').prepareCreate(instance => {
      instance.patientId = patientId
      instance.number = phoneSanitazer(phone.number)
      instance.isPrimary = Boolean(phone.isPrimary)
    })) || [])
  ]

}
