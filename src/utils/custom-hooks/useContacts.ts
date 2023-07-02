import { useState, useEffect } from "react"
import * as Contacts from 'expo-contacts'
import getDatabase from "../../db"
import Patient from "../../db/models/Patient"

let hashPatients: Record<NonNullable<Patient['contactId']>, boolean> = {}
let savedContacts: { data: Contacts.ContactResponse['data'] } = { data: [] }

export const useContacts = (isUnique?: boolean) => {
  const [contacts, setContacts] = useState<[Contacts.PermissionStatus | null, Array<Contacts.Contact>]>([null, []])

  const setContactsFiltered = (status: Contacts.PermissionStatus) => {
    
    if (isUnique) {
      return setContacts([status, savedContacts.data.filter((contact) => !hashPatients[contact.id])])
    }

    setContacts([status, savedContacts.data])
  }

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync()

      if (status === 'granted') {

        const patients = await getDatabase().get<Patient>('patients').query().fetch()

        hashPatients = patients.reduce<typeof hashPatients>((acc, patient) => {

        if (patient.contactId) {
          acc[patient.contactId] = true
        }

        return acc
      }, {})

        savedContacts = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.ImageAvailable,
            Contacts.Fields.Image,
            Contacts.Fields.ID,
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
