import { View, Linking } from 'react-native'
import styled from 'styled-components/native'
import { Foundation } from '@expo/vector-icons'
import { IconButton } from 'react-native-paper'
import withObservables from '@nozbe/with-observables';
import { GrayText, Button, Container, PlusButton, PatientAppointmentList } from '../components'
import { useState } from 'react';
import { useModal } from '../context/modal-context';

const PatientDetail = ({ navigation, patient, appointments, formulas }) => {
  const [openedMenu, setOpenedMenu] = useState(null)
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

  return (
      <View 
        style={{ flex: 1, zIndex: 100 }} 
        onStartShouldSetResponder={evt => setOpenedMenu(null)}>
      <PatientDetails>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <PatientFullname>
              {patient.fullName}
            </PatientFullname>
            <GrayText>
              {patient.phone}
            </GrayText>
          </View>
          <View style={{ flexDirection:'row' }}>
            <IconButton
                icon="pencil-circle"
                color="gray"
                size={30}
                onPress={() => navigation.navigate('AddPatient', { patient })}
                style={{ padding: 0 }}
            />
            <IconButton
                icon="delete"
                color="red"
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
        </PatientButtons>
      </PatientDetails>
      <Container>
        <PatientAppointmentList 
          appointments={appointments}
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
          navigation={navigation}
          patient={patient}
        />
      </Container>
      <PlusButton onPress={() => navigation.navigate('AddAppointment', { patient })}/>
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
    appointments: route.params.patient.appointments
}))(PatientDetail);
