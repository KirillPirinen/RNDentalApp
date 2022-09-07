import { useState, useEffect } from "react"
import * as Contacts from 'expo-contacts'

export const useContacts = () => {
  const [contacts, setContacts] = useState([null, null])

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync()

      let data

      if (status === 'granted') {
         data = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.PhoneNumbers,
          ],
        })
      }

      setContacts([status, data])

    })()

  }, [])

  return contacts
}
