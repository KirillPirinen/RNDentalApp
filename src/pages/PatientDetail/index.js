import React, { useCallback, useEffect } from 'react'
import { View, SafeAreaView, Linking, StyleSheet, useWindowDimensions } from 'react-native'
import withObservables from '@nozbe/with-observables'
import { Text } from 'react-native-paper'
import { Button, PatientAppointmentList, FAB, PhonesList,
  CallButton, WhatsappButton, TelegramButtom, ButtonRowPanel } from '../../components'
import { useGeneralControl } from '../../context/general-context'
import { useFabControlsRef } from '../../utils/custom-hooks/useSafeRef'
import { getPrimaryPhoneNumber } from '../../utils/getPrimaryPhoneNumber'
import ImagePickerExample from '../../components/ImagePicker.js'
import { AppointmentsListTab } from './TabsContent/AppointmentsListTab'

const ObservablePatientAppointmentList = withObservables(['patient'], ({ patient }) => ({
  appointments: patient.sortedAppointments
}))(PatientAppointmentList)


const PatientDetail = ({ navigation, patient, phones }) => {
  const [actions, dispatch] = useGeneralControl()

  const onDeletePatient = () => patient.deleteInstance().then(() => {
    dispatch({ type: actions.CLEAR })
    navigation.popToTop()
  })

  const onConfirmDeletePatient = () => dispatch({ 
    type: actions.CONFIRM_DELETE,
    payload: { patient, onDelete: onDeletePatient, mode: 'patient' }
  })

  const onCall = () => {
    Linking.openURL(`tel:${getPrimaryPhoneNumber(phones)}`).catch(() => {
      dispatch({ 
        type: actions.INFO,
        payload: { 
          text: 'К сожалению мы не смогли открыть приложение для звонка',
          color: 'errorContainer'
        }
      })
    })
  }

  const onSendMessage = (mode) => () => dispatch({ 
    type: actions.CHOOSE_TEMPLATE,
    payload: { patient, mode, phone: getPrimaryPhoneNumber(phones) }
  })

  const [ref, onDrop, onDrag] = useFabControlsRef()

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

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const renderScene = useCallback(({ route }) => {
    switch (route.key) {
      case 'first':
        return <AppointmentsListTab patient={patient} />;
      case 'second':
        return <SecondRoute />;
      default:
        return null;
    }
  }, [patient])

  return (
      <SafeAreaView style={styles.pageWrapper}>
        <View style={styles.patientDetails}>
          <View style={styles.metaWrapper}>
            <View style={styles.nameWrapper}>
              <Text style={styles.patientFullname}>
                {patient.fullName}
              </Text>
            </View>
            <ButtonRowPanel 
              onEdit={() => navigation.navigate('AddPatient', { patient, phones })}
              onDelete={onConfirmDeletePatient}
            />
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
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  patientListWrapper: { paddingHorizontal: 25 },
  pageWrapper: { flex: 1, zIndex: 100 },
  patientDetails: { maxHeight: 300, padding: 25 },
  formulaButtonView: { flex: 1 },
  patientButtons: { flexDirection: 'row', marginTop: 20 },
  nameWrapper: { flexShrink: 2 },
  patientFullname: {
    fontWeight:'800',
    fontSize: 24,
    lineHeight: 30,    
    marginBottom: 3
  },
  phoneListWrapper: { flexDirection: 'row', flexWrap:'wrap', justifyContent:'space-between' },
  metaWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  }
})

export default withObservables(['route'], ({ route }) => ({
    patient: route.params.patient,
    phones: route.params.patient.phones
}))(PatientDetail)