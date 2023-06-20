import { useState, useEffect } from "react"
import * as Contacts from 'expo-contacts'
import database from "../../db"

let hashPatients = {}
let savedContacts = { data: [] }

export const useContacts = (isUnique) => {
  const [contacts, setContacts] = useState([null, []])

  const setContactsFiltered = (status) => {
    
    if (isUnique) {
      return setContacts([status, savedContacts.data.filter((contact) => !hashPatients[contact.id])])
    }

    setContacts([status, savedContacts.data])
  }

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync()

      if (status === 'granted') {

        const patients = await database.get('patients').query().fetch()

        hashPatients = patients.reduce((acc, patient) => {

        if(patient.contactId) {
          acc[patient.contactId] = true
        }

        return acc
      }, {})

        savedContacts = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.ImageAvailable,
            Contacts.Fields.Image,
            Contacts.Fields.id,
          ],
        })
        
      }

      setContactsFiltered(status)
    })()

  }, [])

  useEffect(() => {
    if(contacts[0] !== null) {
      setContactsFiltered(contacts[0])
    }
  }, [isUnique])

  return contacts
}
