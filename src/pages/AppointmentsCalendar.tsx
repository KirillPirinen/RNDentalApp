import { FC, useCallback, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Appointment from '../db/models/Appointment'
import { AppointmentsCalendar } from '../widgets/AppointmentsCalendar'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { getAppointmentsByMonth } from '../db/raw-queries'
import debounce from 'lodash.debounce'

type AppointmentsCalendarProps = {
  appointments: Array<Appointment>
}

type StateDate = { year: number, month: number }

const AppointmentsCalendarPage: FC<AppointmentsCalendarProps> = () => {
  const database = useDatabase()
  const [date, setDate] = useState<StateDate>(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const onMonthChange = useCallback(debounce(setDate, 500), [])

  useEffect(() => {
    const observable = database.get<Appointment>('appointments')
      .query(getAppointmentsByMonth(date.month, date.year))
      .observeWithColumns(['date', 'patient_id', 'duration', 'notes'])
    
      const subscription = observable.subscribe(setAppointments)

      return () => {
        subscription?.unsubscribe()
      }
  }, [date])

  return (
    <View style={styles.wrapper}>
      <AppointmentsCalendar
        appointments={appointments}
        onMonthChange={onMonthChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { height: '100%' }
})

export default AppointmentsCalendarPage
