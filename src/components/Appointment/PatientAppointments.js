import styled from 'styled-components/native'
import { Foundation, Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { Text } from 'react-native-paper'
import { Badge } from '../'
import formatRu from '../../utils/formatRu'

export const PatientAppointment = ({ appointment }) => {
  return (
    <AppointmentCard>
      {Boolean(appointment.teeth) && <Teeth teeth={appointment.teeth} />}
      {Boolean(appointment.diagnosis) && <Diagnosis diagnosis={appointment.diagnosis} />}
      {Boolean(appointment.notes) && <Notes notes={appointment.notes} />}
      <AppointmentCardRow
        style={{ marginTop: 15, justifyContent: 'space-between' }}
      >
        <Badge style={{ width: 200 }}>
          {formatRu(appointment.date, 'PPpp')}
        </Badge>
      </AppointmentCardRow>
      {appointment.price && <PriceBadge status="green">{appointment.price} &#8381;</PriceBadge>}
    </AppointmentCard>
  )
}

const Teeth = ({ teeth }) => {
  const count = teeth?.split(',')
  return (
    <AppointmentCardRow>
      <FontAwesome5 name="tooth" size={16} color="#A3A3A3" />
      <AppointmentCardLabel>
        {count.length > 1 ? 'Зубы: ' : 'Зуб: '}
        <Text style={{ fontWeight: '600' }}>
          {count.join(', ')}
        </Text>
      </AppointmentCardLabel>
    </AppointmentCardRow>
  )
}

const Diagnosis = ({ diagnosis }) => (
  <AppointmentCardRow>
    <FontAwesome5
      name="notes-medical"
      size={16}
      color="#A3A3A3"
    />
    <AppointmentCardLabel>
      Диагноз:{' '}
      <Text style={{ fontWeight: '600' }}>{diagnosis}</Text>
    </AppointmentCardLabel>
  </AppointmentCardRow>
)

const Notes = ({ notes }) => (
  <AppointmentCardRow>
    <Foundation
      name="clipboard-notes"
      size={16}
      color="#A3A3A3"
    />
    <AppointmentCardLabel>
      Заметки:{' '}
      <Text style={{ fontWeight: '600' }}>{notes}</Text>
    </AppointmentCardLabel>
  </AppointmentCardRow>
)

const PriceBadge = styled(Badge)`
  position: absolute;
  width: auto;
  padding: 0 5px;
  top: -10px;
  right: 0;
  z-index: 100;
  background-color: white;
  border: 1px solid #7da453;
`

const AppointmentCardLabel = styled.Text`
  font-size: 16px;
  margin-left: 10px;
`;

const AppointmentCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 3.5px;
  margin-bottom: 3.5px;
`;

const AppointmentCard = styled.View`
  shadow-color: gray;
  elevation: 0.5;
  shadow-opacity: 0.4;
  shadow-radius: 10;
  padding: 20px 25px;
  border-radius: 10px;
  background: white;
  margin-bottom: 20px;
`;
