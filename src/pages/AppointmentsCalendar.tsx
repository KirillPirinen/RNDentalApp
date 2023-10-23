import { FC, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Appointment from '../db/models/Appointment'
import { AppointmentsCalendar } from '../widgets/AppointmentsCalendar'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { getAppointmentsByMonth } from '../db/raw-queries'
import { CalendarUtils } from 'react-native-calendars'

type AppointmentsCalendarProps = {
  appointments: Array<Appointment>
}

const AppointmentsCalendarPage: FC<AppointmentsCalendarProps> = () => {
  const database = useDatabase()
  const now = new Date()
  const [currentDate, setCurrentDate] = useState(() => CalendarUtils.getCalendarDateString(now))
  const [date, setDate] = useState<{ year: number, month: number }>({ year: now.getFullYear(), month: now.getMonth() + 1 })
  const [appointments, setAppointments] = useState<Appointment[]>([])
  
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
        onMonthChange={setDate}
        onDateChanged={setCurrentDate}
        currentDate={currentDate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { height: '100%' }
})

export default AppointmentsCalendarPage
