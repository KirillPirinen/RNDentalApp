import { FC, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Modal } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '..'
import Patient from '../../../db/models/Patient'
import { Button, PatientAppointment } from '../../../components'
import Appointment from '../../../db/models/Appointment'
import { modalContentsAction } from '../../../context/general-context/action-types'
import { PatientLabel } from '../../../components/PatientLabel'
import { Trans } from '@lingui/macro'

export type PatientAppointmentDetailsProps = ContextedPortalDefaultProps<{
  patient: Patient,
  appointment: Appointment
}>

export const PatientAppointmentDetails: FC<PatientAppointmentDetailsProps> = ({ 
  __visible, 
  __defaultProps,
  patient,
  appointment,
}) => {

  const onEditAppointment = useCallback((appointment: Appointment, isConfirmation?: boolean) => {
    if(isConfirmation) {
      return __defaultProps.navigation.navigate('ConfirmAppointment', { patient, appointment, edit: true })
    }
    __defaultProps.navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  }, [patient])

  const onArchive = useCallback((appointment: Appointment) => {
    appointment.updateInstance({ isArchive: !appointment.isArchive });
  }, [])

  return (
    <Modal
      onDismiss={__defaultProps.clear}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    >
      <PatientLabel patient={patient} showAvatar />
      <PatientAppointment 
        appointment={appointment} 
        theme={__defaultProps.theme} 
        onEditAppointment={onEditAppointment}
        onArchiveAppointment={onArchive}
      />
      <View style={styles.mainButtonWrapper}>
      <Button style={styles.mainButtom} onPress={() => __defaultProps.navigation.navigate('Detail', { patient })}><Trans>Карточка</Trans></Button>
        <Button style={styles.mainButtom} onPress={() => __defaultProps.navigation.navigate('TeethFormula', { patient })}><Trans>Зубная форумула</Trans></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  mainButtom:{ paddingHorizontal: 20 },
  mainButtonWrapper: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-evenly' },
  modal: { backgroundColor: 'white', padding: 20 },
  bold: {
    fontWeight: '600'
  },
  tooltip: {
    padding: 20,
    minHeight: 70,
    backgroundColor: 'white'
  },
  clear: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 100,
    backgroundColor:'#FFF176'
  },
  cancel: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 100
  },
  submit: { marginTop: 30 }
})
