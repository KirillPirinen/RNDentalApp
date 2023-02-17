import { View } from 'react-native'
import withObservables from '@nozbe/with-observables'
import { PatientAppointmentList } from '../../../components'
import { styles } from '../styles'
import { memo } from 'react'

const ObservablePatientAppointmentList = withObservables(['patient'], ({ patient }) => ({
  appointments: patient.sortedAppointments
}))(PatientAppointmentList)

export const AppointmentsListTab = ({ patient, navigation, ...rest }) => {
  return (
        <View style={styles.patientListWrapper}>
          <ObservablePatientAppointmentList 
            navigation={navigation}
            patient={patient}
            style={{ marginBottom: -60 }}
            {...rest}
          />
        </View>
  )
}

export default memo(AppointmentsListTab)
