import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import * as Contacts from 'expo-contacts'

const ImportContacts = () => {

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync()

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.FirstName,
            Contacts.Fields.LastName,
          ],
        })

        if (data.length > 0) {
          const contact = data[0]
          console.log(data)
        }
      }
    })()
  }, [])
  
  return (
    <View><Text>Import page</Text></View>
  )
}

export default ImportContacts
