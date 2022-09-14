import { database } from '..'
import { phoneSanitazer } from '../../utils/sanitizers'

export const createPatient = async ({ fullName, phones, phoneNumbers, name, id }) => {
  const phonesToBatch = phones || phoneNumbers
  const recievedName = fullName || name

  return await database.write(async () => {
    
      const newPatient = await database.get('patients').create(patient => {
        patient.fullName = recievedName
        patient.hasWhatsapp = true
        patient.hasTelegram = true
        patient.contactId = id
      })

      const batches = phonesToBatch?.map(phone => {
          return database.get('phones').prepareCreate(instance => {
            instance.patientId = newPatient.id
            instance.number = phoneSanitazer(phone.number)
            instance.isPrimary = Boolean(phone.isPrimary)
          })
        }) || {}

      await database.batch(
        database.get('formulas').prepareCreate(formula => {
          formula.patientId = newPatient.id
          formula.hasAdultJaw = true
          formula.hasBabyJaw = false
        }),
        ...batches
      )

      return newPatient
    } 
  )
}

export const createAppointment = async ({ patientId, date, diagnosis, notes, duration }) => {
  return await database.write(async () => await database.get('appointments').create(appointment => {
      appointment.patientId = patientId
      appointment.date = date
      appointment.diagnosis = diagnosis
      appointment.notes = notes
      appointment.duration = duration
    })  
  )
}

export const createTooth = async ({ patientId, toothNo, toothState }) => {
  return await database.write(async () => await database.get('teeth').create(tooth => {
      tooth.patientId = patientId
      tooth.toothNo = toothNo
      tooth.toothState = toothState
    })
  )
}

export const createPhone = async ({ patientId, number, isPrimary = false }) => {
  return await database.write(async () => await database.get('phones').create(phone => {
      phone.patientId = patientId
      phone.number = number
      phone.isPrimary = isPrimary
    })
  )
}

export const createTemplate = async ({ text, name }) => {
  return await database.write(async () => await database.get('templates').create(template => {
      template.name = name
      template.text = text
    })
  )
}
