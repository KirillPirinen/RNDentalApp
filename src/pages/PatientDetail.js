import React, { useRef } from 'react'
import { View, Linking } from 'react-native'
import styled from 'styled-components/native'
import { Foundation } from '@expo/vector-icons'
import { Fontisto } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper'
import withObservables from '@nozbe/with-observables';
import { GrayText, Button, Container, PatientAppointmentList, FAB } from '../components'
import { useModal } from '../context/modal-context';

const PatientDetail = ({ navigation, patient, appointments, phones }) => {
  const [actions, dispatch] = useModal()

  const onDeletePatient = () => patient.deleteInstance().then(() => {
    dispatch({ type: actions.CLEAR })
    navigation.popToTop()
  })

  const onConfirmDeletePatient = () => dispatch({ 
    type: actions.CONFIRM_DELETE_PATIENT,
    payload: { patient, onDelete: onDeletePatient }
  })

  const onCall = () => Linking.openURL(`tel:${patient.phone}`)
  const onWhatsApp = () => Linking.openURL(`whatsapp://send?text=hello&phone=${patient.phone}`)

  const buttonControls = useRef()

  const onDrug = () => buttonControls.current?.setVisible(false)
  const onDrop = () => buttonControls.current?.setVisible(true)

  return (
      <View 
        style={{ flex: 1, zIndex: 100 }} 
      >
      <PatientDetails>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
        }}>
          <View style={{ flexShrink: 2 }}>
            <PatientFullname>
              {patient.fullName}
            </PatientFullname>
            <GrayText>
              {phones.map(phone => phone.number).join(', ')}
            </GrayText>
          </View>
          <View style={{ flexDirection:'row' }}>
            <IconButton
                icon="pencil-circle"
                iconColor="gray"
                size={30}
                onPress={() => navigation.navigate('AddPatient', { patient, phones })}
                style={{ padding: 0 }}
            />
            <IconButton
                icon="delete"
                iconColor="red"
                size={30}
                onPress={onConfirmDeletePatient}
                style={{ padding: 0 }}
            />
          </View>
        </View>
        <PatientButtons>
          <FormulaButtonView>
            <Button onPress={() => navigation.navigate('TeethFormula', { patient })}>Формула зубов</Button>
          </FormulaButtonView>
          <PhoneButtonView>
            <Button
              color="#84D269"
              onPress={onCall}
            >
              <Foundation name="telephone" size={22} color="white" />
            </Button>
          </PhoneButtonView>
          <PhoneButtonView>
            <Button
              color="#84D269"
              onPress={onWhatsApp}
            >
              <Fontisto name="whatsapp" size={24} color="white" />
            </Button>
          </PhoneButtonView>
        </PatientButtons>
      </PatientDetails>
      <Container>
        <PatientAppointmentList 
          appointments={appointments}
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


const PatientDetails = styled.View`
  flex: 0.3;
  padding: 25px;
`;

const FormulaButtonView = styled.View`
  flex: 1;
`;

const PhoneButtonView = styled.View`
  margin-left: 10px;
  width: 45px;
`;

const PatientButtons = styled.View`
  flex: 1;
  flex-direction: row;
  margin-top: 20px;
`;

const PatientFullname = styled.Text`
  font-weight: 800;
  font-size: 24px;
  line-height: 30px;
  margin-bottom: 3px;
`;


export default withObservables(['route'], ({ route }) => ({
    patient: route.params.patient,
    phones: route.params.patient.phones,
    appointments: route.params.patient.appointments
}))(PatientDetail);
