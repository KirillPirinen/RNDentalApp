import { FC } from 'react'
import withObservables from '@nozbe/with-observables'
import { View, StyleSheet } from 'react-native'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import Appointment from '../db/models/Appointment'
import { Database } from '@nozbe/watermelondb'
import { AppointmentsCalendar } from '../widgets/AppointmentsCalendar'

type AppointmentsCalendarProps = {
  appointments: Array<Appointment>
}

const AppointmentsCalendarPage: FC<AppointmentsCalendarProps> = ({ appointments }) => {
  return (
    <View style={styles.wrapper}>
      <AppointmentsCalendar appointments={appointments} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { height: '100%' }
})

export default withDatabase(
  withObservables([], ({ database }: { database: Database }) => ({
    appointments: database.get<Appointment>('appointments').query().observeWithColumns(['date', 'patient_id', 'duration', 'notes'])
  }))(AppointmentsCalendarPage),
)
