import database from '..'
import { phoneSanitazer } from '../../utils/sanitizers'

export const getPatientBatches = ({ fullName, phones, phoneNumbers, name, id }) => {
  const phonesToBatch = phones || phoneNumbers
  const recievedName = fullName || name

  let newPatientId

  return [
    database.get('patients').prepareCreate(patient => {
      patient.fullName = recievedName
      patient.hasWhatsapp = true
      patient.hasTelegram = true
      patient.contactId = id

      newPatientId = patient.id
    }),
    database.get('formulas').prepareCreate(formula => {
      formula.patientId = newPatientId
      formula.hasAdultJaw = true
      formula.hasBabyJaw = false
    }),
    ...(phonesToBatch?.map(phone => database.get('phones').prepareCreate(instance => {
      instance.patientId = newPatientId
      instance.number = phoneSanitazer(phone.number)
      instance.isPrimary = Boolean(phone.isPrimary)
    })) || [])
  ]

}
