import { FC, useEffect, useState } from 'react'
import { HighlightedText } from './HighlightedText'
import Patient from '../db/models/Patient'
import Phone from '../db/models/Phone';

export type PatientPhonesProps = {
  patient: Patient;
  query?: string;
}

export const PatientPhones: FC<PatientPhonesProps> = ({ patient, query }) => {
  const [phones, setPhones] = useState('')

  useEffect(() => {
    patient.phones.fetch().then((phones: Array<Phone>) => {
      setPhones(phones.map((phone) => phone.number).join(`, `))
    })
  }, [patient])

  return phones && <HighlightedText text={phones} query={query} />
}
