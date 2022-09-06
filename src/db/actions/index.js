import { database } from '..'

export const createPatient = async ({ fullName, phones }) => {

  return await database.write(async () => {
    
      const newPatient = await database.get('patients').create(patient => {
        patient.fullName = fullName
      })

      await database.get('formulas').create(formula => {
        formula.patientId = newPatient.id
        formula.hasAdultJaw = true
        formula.hasBabyJaw = false
      })

      if(phones?.length) {
        await Promise.all(phones.map(phone => {
          return database.get('phones').create(instance => {
            instance.patientId = newPatient.id
            instance.number = phone.number
          })
        }))
      }

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

