import { View, SafeAreaView } from 'react-native'
import withObservables from '@nozbe/with-observables'
import { PatientAppointmentList, FAB } from '../../../components'
import { useFabControlsRef } from '../../../utils/custom-hooks/useSafeRef'
import { useNavigation } from '@react-navigation/native'
import { styles } from '../styles'

const ObservablePatientAppointmentList = withObservables(['patient'], ({ patient }) => ({
  appointments: patient.sortedAppointments
}))(PatientAppointmentList)

export const AppointmentsListTab = ({ patient }) => {
  const [ref, onDrop, onDrag] = useFabControlsRef()
  const navigation = useNavigation()
  return (
      <>
        <View style={styles.patientListWrapper}>
          <ObservablePatientAppointmentList 
            navigation={navigation}
            patient={patient}
            onScrollBeginDrag={onDrag}
            onScrollEndDrag={onDrop}
          />
        </View>
        <FAB
          ref={ref} 
          label={`Записать пациента`}
          onPress={() => navigation.navigate('AddAppointment', { patient })}
        />
      </>
  )
}
