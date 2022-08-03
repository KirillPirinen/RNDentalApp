import { database } from '../'

export const createPatient = async (data) => {
  try {
    await database.get('patients').addNew(data)
  } finally {
    console.log('ok')
  }
}

export const createPatients2 = async (data) => {
  const newPost = await database.write(async () => {
    const post = await database.get('patients').create(patient => {
      patient.fname = data.fname
      patient.lname = data.lname
    })  
    // Note: Value returned from the wrapped function will be returned to `database.write` caller
    return post
  })
}
