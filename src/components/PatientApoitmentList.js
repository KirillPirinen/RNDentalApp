import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
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

  const [actions, dispatch] = useModal()

  const onEditAppointment = useCallback((appointment) => {
      navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  }, [patient])

  const onConfirmDeleteAppointment = useCallback((appointment) => {
    const onDelete = () => appointment.deleteInstance().then(dispatch.bind(null, { type: actions.CLEAR }))
    dispatch({ 
      type: actions.CONFIRM_DELETE_APPOINTMENT,
      payload: { patient, appointment, onDelete }
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
      />
    )
  }

  return <FlatList
      data={appointments}
      renderItem={renderAppointments}
      keyExtractor={defaultExtractor}
      {...rest}
    />
}
