import database from '..'
import { getPatientBatches, getPatientRelationsBatches } from '../utils/batches.js'

export const updateTeethState = async (id) => {
  await database.write(async () => {
    // sqlite:
    await database.adapter.unsafeExecute({
      sqls: [
        [updateTeethState(id)]
      ]
    })
  })
}

export const createPatientsBulk = async (contentArray) => {
  const batches = contentArray.reduce((acc, el) => acc.concat(getPatientBatches(el)), [])
  return await database.write(async () => await database.batch(batches))
}

export const createPatient = async ({ fullName, phones, phoneNumbers, name, id }, { withReturn } = {}) => {
  const recievedName = fullName || name
  const phonesToBatch = phones || phoneNumbers

  if(!withReturn) {
    return await database.write(async () => await database.batch(...getPatientBatches({ 
      fullName: recievedName, 
      phones: phonesToBatch, 
      id 
    })))
  }

  return await database.write(async () => {

    const patient = await database.get('patients').create(patient => {
      patient.fullName = recievedName
      patient.hasWhatsapp = true
      patient.hasTelegram = true
      patient.contactId = id
    })

    await database.batch(...getPatientRelationsBatches({ 
      phones: phonesToBatch, 
      patientId: patient.id 
    }))
    
    return patient
  })

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

export const createTooth = async ({ formulaId, toothNo, toothState, notes }) => {
  return await database.write(async () => await database.get('teeth').create(tooth => {
      tooth.formulaId = formulaId
      tooth.toothNo = toothNo
      tooth.toothState = toothState
      tooth.notes = notes
    })
  )
}

export const findOrCreateTeeth = async (appointment, teeth) => {
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

export const createSetting = async ({ name, value }) => {
  return await database.write(async () => await database.get('settings').create(template => {
      template.name = name
      template.value = value
    })
  )
}

export const createFile = async ({ name, type, patientId }) => {
  return await database.write(async () => await database.get('files').create(template => {
      template.name = name
      template.type = type
      template.patientId = patientId
    })
  )
}

