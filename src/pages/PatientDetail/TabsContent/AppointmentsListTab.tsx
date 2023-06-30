import { View } from 'react-native'
import withObservables from '@nozbe/with-observables'
import { PatientAppointmentList, PatientAppointmentListProps } from '../../../components/PatientApoitmentList'
import { styles } from '../styles'
import { FC, memo } from 'react'
import PatientModel from '../../../db/models/Patient'
import { NavigationProp } from '@react-navigation/native'

const ObservablePatientAppointmentList = withObservables(['patient'], ({ patient }) => ({
  appointments: patient.sortedAppointments
}))(PatientAppointmentList)

export type AppointmentsListTabProps = Partial<PatientAppointmentListProps> & {
  patient: PatientModel;
  navigation: NavigationProp<ReactNavigation.RootParamList>
}

const margin = { marginBottom: -60 }

export const AppointmentsListTab: FC<AppointmentsListTabProps> = ({ patient, navigation, ...rest }) => {
  return (
    <View style={styles.patientListWrapper}>
      <ObservablePatientAppointmentList 
        navigation={navigation}
        patient={patient}
        style={margin}
        {...rest}
      />
    </View>
  )
}

export default memo(AppointmentsListTab)
