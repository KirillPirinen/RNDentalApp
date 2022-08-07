import { database } from '..'

export const createPatient = async ({ fname, lname, phone }) => await database.write(
  async () => await database.get('patients').create(patient => {
        patient.fname = fname
        patient.lname = lname
        patient.phone = phone
      })  
  )

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
