import { useDatabase } from "@nozbe/watermelondb/hooks"
import { useEffect, useState } from "react"
import Patient from "../../db/models/Patient"

export const usePatients = () => {
  const db = useDatabase()
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    db.get<Patient>('patients').query().fetch().then(setPatients)
  }, [])

  return patients
}
