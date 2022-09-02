import styled from 'styled-components/native'
import { StyleSheet, View } from 'react-native'
import { Foundation, FontAwesome5 } from '@expo/vector-icons'
import { Text, Menu, IconButton, Divider } from 'react-native-paper'
import Badge from '../Badge'
import formatRu from '../../utils/formatRu'
import { memo, useState } from 'react'

export const PatientAppointment = memo(({ 
  appointment, 
  onEditAppointment, 
  onDeleteAppointment 
}) => {
  return (
    <View style={styles.card}>
      <View style={{ 
          marginTop: -25,  
          flexDirection:'row-reverse'
        }}>
        <MenuApointment 
          appointment={appointment}
          onEditAppointment={onEditAppointment}
          onDeleteAppointment={onDeleteAppointment}
        />
      </View>
      <AppointmentCardRow style={{ marginTop: -20 }}>
        <FontAwesome5 name="clock" size={16} color="#A3A3A3" />
        <AppointmentCardLabel>
         {`Длительность: `}
          <Text style={{ fontWeight: '600' }}>
            {`${appointment.duration} минут`}
          </Text>
        </AppointmentCardLabel>
      </AppointmentCardRow>
      {Boolean(true/*appointment.teeth*/) && <Teeth teeth={appointment.teeth || '1,2,3,4'} />}
      {Boolean(appointment.diagnosis) && <Diagnosis diagnosis={appointment.diagnosis} />}
      {Boolean(appointment.notes) && <Notes notes={appointment.notes} />}
      <AppointmentCardRow
        style={{ marginTop: 15, justifyContent: 'space-between' }}
      >
        <Badge style={{ width: 200 }}>
          {formatRu(appointment.date, 'PPpp')}
        </Badge>
      </AppointmentCardRow>
      {true /*diagnosis*/ && <PriceBadge status="green">{appointment.price || 2000} &#8381;</PriceBadge>}
    </View>
  )
})


const Teeth = ({ teeth }) => {
  const count = teeth.split(',')
  return (
    <AppointmentCardRow>
      <FontAwesome5 name="tooth" size={16} color="#A3A3A3" />
      <AppointmentCardLabel>
        {count?.length > 1 ? 'Зубы: ' : 'Зуб: '}
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

const MenuApointment = ({ onEditAppointment, appointment, onDeleteAppointment }) => {
  const [visible, setVisible] = useState(false)
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<IconButton 
        onPress={() => setVisible(true)}
        icon="menu"
        size={20}
      />}
      contentStyle={{ backgroundColor: 'white' }}
    >
      <Menu.Item onPress={() => {
        setVisible(false)
        onDeleteAppointment(appointment)
        
      }} 
        title="Удалить" 
      />
      <Divider bold />
      <Menu.Item onPress={() => onEditAppointment(appointment)} title="Редактировать" />
    </Menu>
  )
}


const PriceBadge = styled(Badge)`
  position: absolute;
  width: auto;
  padding: 0 5px;
  top: -6px;
  left: 0;
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


const styles = StyleSheet.create({
  card: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity:  0.17,
    shadowRadius: 3.05,
    elevation: 2,
    borderRadius: 10,
    padding: 20,
    marginVertical: 5,
    borderColor:'#dddddd',
    borderWidth:1,
    backgroundColor: '#fff'
  }
})
