import { database } from '..'

export const createPatient = async ({ fname, lname, phone }) => await database.write(
  async () => await database.get('patients').create(patient => {
        patient.fname = fname
        patient.lname = lname
        patient.phone = phone
      })  
  )

export const createAppointment = async ({ patientId, date }) => {
  return await database.write(async () => await database.get('appointments').create(appointment => {
      appointment.patientId = patientId
      appointment.date = date
    })  
  )
}
