import styled from 'styled-components/native'
import { View } from 'react-native'
import { Foundation, FontAwesome5 } from '@expo/vector-icons'
import { Text, Menu, IconButton, Divider } from 'react-native-paper'
import Badge from '../Badge'
import formatRu from '../../utils/formatRu'
import { memo } from 'react'

export const PatientAppointment = memo(({ appointment, isMenuOpen, setOpenedMenu, onEditAppointment, onDeleteAppointment }) => {
  return (
    <AppointmentCard>
      <MenuApointment 
        isOpen={isMenuOpen} 
        setOpenedMenu={setOpenedMenu} 
        id={appointment.id}
        onEditAppointment={onEditAppointment}
        onDeleteAppointment={onDeleteAppointment}
        appointment={appointment}
      />
      <AppointmentCardRow>
        <FontAwesome5 name="clock" size={16} color="#A3A3A3" />
        <AppointmentCardLabel>
         {`Длительность: `}
          <Text style={{ fontWeight: '600' }}>
            {`${appointment.duration} минут`}
          </Text>
        </AppointmentCardLabel>
      </AppointmentCardRow>
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
})


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
      {`Диагноз: `}
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

const MenuApointment = ({ setOpenedMenu, isOpen, id, onEditAppointment, appointment, onDeleteAppointment }) => {
  
  return isOpen ? (
    <View style={{
      flex: 1,
      position:'absolute',
      backgroundColor: 'rgba(215,204,200, 1)',
      zIndex:100,
      right:2,
      borderWidth:1,
      borderColor: '#a1887f',
      borderRadius:6,
    }}>
      <Menu.Item leadingIcon="redo" onPress={() => onDeleteAppointment(appointment)} title="Удалить" />
      <Divider style={{ backgroundColor: '#78909c' }} />
      <Menu.Item leadingIcon="undo" onPress={() => onEditAppointment(appointment)} title="Редактировать" />
    </View>
  ) : <IconButtonStyled
        icon="menu"
        size={20}
        color={'gray'}
        onPress={() => setOpenedMenu(id)}
      />
}

const IconButtonStyled = styled(IconButton)`
  position:absolute;
  right: 0;
  top: 0;
`

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
