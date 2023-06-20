import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { HighlightedText } from './ HighlightedText.js'

export const PatientPhones = ({ patient, query }) => {
  const [phones, setPhones] = useState('')

  useEffect(() => {
    patient.phones.fetch().then((phones) => {
      setPhones(phones.map((phone) => phone.number).join(`, `))
    })
  }, [patient])

  return phones && <HighlightedText text={phones} query={query} />
}
