import { View, Linking } from 'react-native'
import styled from 'styled-components/native'
import { Foundation } from '@expo/vector-icons'
import { IconButton, Button as PaperButton } from 'react-native-paper'
import withObservables from '@nozbe/with-observables';
import { GrayText, Button, Container, Confirm, PlusButton, PatientAppointment } from '../components'
import { useState, useCallback } from 'react'

const inverse = (prev) => !prev

const PatientDetail = ({ navigation, patient }) => {
  const [visible, setVisible] = useState(false)

  const handleToggle = useCallback(() => setVisible(inverse), [])
  const onDelete = () => patient.deleteInstance().then(navigation.popToTop)
  const onCall = () => Linking.openURL(`tel:${patient.phone}`)

  return (
    <View style={{ flex: 1 }}>
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
                onPress={handleToggle}
                style={{ padding: 0 }}
            />
          </View>
        </View>
        <PatientButtons>
          <FormulaButtonView>
            <Button>Формула зубов</Button>
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
      <PatientAppointment />
      <PlusButton/>
      <Confirm 
        visible={visible} 
        title={`Удаление ${patient.fullName}`}
        question="Вы действительно хотите удалить пациента?"
        onClose={handleToggle}
      > 
        <PaperButton
          icon="delete"
          color="red"
          size={30}
          onPress={onDelete}
          style={{ padding: 0 }}
        > 
          удалить 
        </PaperButton>
        <PaperButton
          icon="window-close"
          color="gray"
          size={30}
          onPress={handleToggle}
          style={{ padding: 0 }}
        > 
          отмена 
        </PaperButton>
      </Confirm>
    </View>
  )
}


const PatientDetails = styled(Container)`
  flex: 0.3;
`;

const PatientAppointments = styled.View`
  flex: 1;
  background: #f8fafd;
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
    patient: route.params.patient
}))(PatientDetail);
