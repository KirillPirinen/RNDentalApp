import { database } from '../'

export const createPatient = async (fname, lname) => {
  try {
    await database.addNew(fname, lname)
  } finally {
    console.log('ok')
  }
}

export const createPatients2 = async (fname, lname, phone) => {
  const newPost = await database.write(async () => {
    const post = await database.get('patients').create(patient => {
      patient.fname = fname
      patient.lname = lname
      patient.phone = phone
    })  
    return post
  })
}
