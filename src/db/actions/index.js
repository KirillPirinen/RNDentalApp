import { database } from '..'

export const createPatient = async ({ fname, lname, phone }) => {

  return await database.write(async () => {
    
      const newPatient = await database.get('patients').create(patient => {
        patient.fname = fname
        patient.lname = lname
        patient.phone = phone
      })

      await database.get('formulas').create(formula => {
        formula.patientId = newPatient.id
        formula.hasAdultJaw = true
        formula.hasBabyJaw = false
      })

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

