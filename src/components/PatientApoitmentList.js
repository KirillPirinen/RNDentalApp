import React, { useCallback } from 'react'
import { FlatList, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { PatientAppointment } from '../components/Appointment/PatientAppointments'
import { useModal } from '../context/modal-context'
import { defaultExtractor } from '../utils/defaultExtracror'
import withObservables from '@nozbe/with-observables'

const ObservablePatientAppointment = withObservables(['appointment'], ({ appointment }) => ({
  appointment
}))(PatientAppointment)

export const PatientAppointmentList = ({ 
  appointments, 
  setOpenedMenu, 
  openedMenu,
  navigation,
  patient,
  ...rest
}) => {
  const theme = useTheme()
  const [actions, dispatch] = useModal()

  const onEditAppointment = useCallback((appointment) => {
      navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  }, [patient])

  const onConfirmDeleteAppointment = useCallback((appointment) => {
    const onDelete = () => appointment.deleteInstance().then(dispatch.bind(null, { type: actions.CLEAR }))
    dispatch({ 
      type: actions.CONFIRM_DELETE,
      payload: { patient, appointment, onDelete, mode: 'appointment' }
    })
  }, [])

  const renderAppointments = ({ item }) => {
    return (
      <ObservablePatientAppointment 
        appointment={item}
        setOpenedMenu={setOpenedMenu}
        isMenuOpen={openedMenu === item.id}
        onEditAppointment={onEditAppointment}
        onDeleteAppointment={onConfirmDeleteAppointment}
        theme={theme}
      />
    )
  }

  return (
    <View style={{ height: '90%' }}>
      <FlatList
        data={appointments}
        renderItem={renderAppointments}
        keyExtractor={defaultExtractor}
        contentContainerStyle={{ paddingBottom: 100 }}
        {...rest}
      />
    </View>
  )
}
