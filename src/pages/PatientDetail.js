import React, { useEffect } from 'react'
import { View, Linking, StyleSheet, Text } from 'react-native'
import { IconButton } from 'react-native-paper'
import withObservables from '@nozbe/with-observables'
import { Button, Container, PatientAppointmentList, FAB, PhonesList,
  CallButton, WhatsappButton, TelegramButtom } from '../components'
import { useModal } from '../context/modal-context'
import { useSafeRefCB } from '../utils/custom-hooks/useSafeRef'
import { getPrimaryPhoneNumber } from '../utils/getPrimaryPhoneNumber'

const ObservablePatientAppointmentList = withObservables(['patient'], ({ patient }) => ({
  appointments: patient.sortedAppointments
}))(PatientAppointmentList)

const PatientDetail = ({ navigation, patient, phones }) => {
  const [actions, dispatch] = useModal()

  const onDeletePatient = () => patient.deleteInstance().then(() => {
    dispatch({ type: actions.CLEAR })
    navigation.popToTop()
  })

  const onConfirmDeletePatient = () => dispatch({ 
    type: actions.CONFIRM_DELETE_PATIENT,
    payload: { patient, onDelete: onDeletePatient }
  })

  const onCall = () => {
    Linking.openURL(`tel:${getPrimaryPhoneNumber(phones)}`).catch(() => {
      dispatch({ 
        type: actions.INFO,
        payload: { 
          text: 'К сожалению мы не смогли открыть приложение для звонка',
          color: 'error'
        }
      })
    })
  }

  const onSendMessage = (mode) => () => dispatch({ 
    type: actions.CHOOSE_TEMPLATE,
    payload: { patient, mode, phone: getPrimaryPhoneNumber(phones) }
  })

  const buttonControls = useSafeRefCB()

  const onDrug = () => buttonControls.current(false)
  const onDrop = () => buttonControls.current(true)

  useEffect(() => {
    
    const onWhatsappCheck = () => {
      patient.updateInstance({ hasWhatsapp: !patient.hasWhatsapp })
    }
    const onTelegramCheck = () => {
      patient.updateInstance({ hasTelegram: !patient.hasTelegram })
    }

    navigation.setOptions({
      menu: [{ 
        type: 'TouchableCheckbox', 
        title: 'Telegram', 
        onPress: onTelegramCheck,
        value: patient.hasTelegram
      },
      {
        type: 'TouchableCheckbox', 
        title: 'Whatsapp', 
        onPress: onWhatsappCheck,
        value: patient.hasWhatsapp
      }]
    })
  }, [patient])

  return (
      <View style={styles.pageWrapper}>
        <View style={styles.patientDetails}>
          <View style={styles.metaWrapper}>
            <View style={styles.nameWrapper}>
              <Text style={styles.patientFullname}>
                {patient.fullName}
              </Text>
            </View>
            <View style={styles.actionsWrapper}>
              <IconButton
                  icon="pencil-circle"
                  iconColor="gray"
                  size={30}
                  onPress={() => navigation.navigate('AddPatient', { patient, phones })}
                  style={styles.noPadding}
              />
              <IconButton
                  icon="delete"
                  iconColor="red"
                  size={30}
                  onPress={onConfirmDeletePatient}
                  style={styles.noPadding}
              />
            </View>
          </View>
          <View style={styles.phoneListWrapper}>
            <PhonesList phones={phones} />
          </View>
          <View style={styles.patientButtons}>
            <View style={styles.formulaButtonView}>
              <Button onPress={() => navigation.navigate('TeethFormula', { patient })}>Зубная формула</Button>
            </View>
            <CallButton onPress={onCall} />
            {patient.hasWhatsapp && <WhatsappButton onPress={onSendMessage('whatsapp')} />}
            {patient.hasTelegram && <TelegramButtom onPress={onSendMessage('telegram')} />}
          </View>
        </View>
        <Container>
          <ObservablePatientAppointmentList 
            navigation={navigation}
            patient={patient}
            onScrollBeginDrag={onDrug}
            onScrollEndDrag={onDrop}
          />
        </Container>
        <FAB
          ref={buttonControls} 
          label={`Записать ${patient.fullName}`}
          onPress={() => navigation.navigate('AddAppointment', { patient })}
        />
      </View>
  )
}

const styles = StyleSheet.create({
  pageWrapper: { flex: 1, zIndex: 100 },
  patientDetails: { flex: 0.3, padding: 25 },
  formulaButtonView: { flex: 1 },
  patientButtons: { flex: 1, flexDirection: 'row', marginTop: 20 },
  nameWrapper: { flexShrink: 2 },
  actionsWrapper: { flexDirection:'row' },
  patientFullname: {
    fontWeight:'800',
    fontSize: 24,
    lineHeight: 30,    
    marginBottom: 3
  },
  phoneListWrapper: { flexDirection: 'row', flexWrap:'wrap', justifyContent:'space-between' },
  noPadding: { padding: 0 },
  metaWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  }
})

export default withObservables(['route'], ({ route }) => ({
    patient: route.params.patient,
    phones: route.params.patient.phones
}))(PatientDetail)
