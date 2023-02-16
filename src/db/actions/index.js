import database from '..'
import { getPatientBatches } from '../utils/batches.js'

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

export const createPatient = async (content) => {
  let batches

  if (Array.isArray(content)) {
    batches = content.reduce((acc, el) => acc.concat(getPatientBatches(el)), [])
  } else {
    batches = getPatientBatches(content)
  }

  return await database.write(async () => await database.batch(batches))
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
  return await database.write(async () => await database.get('settings')?.create(template => {
      template.name = name
      template.value = value
    })
  )
}
