import { View, TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'
import { Avatar } from 'react-native-paper'
import GrayText from '../GrayText'
import Badge from '../Badge'
import { addMinutes, format } from 'date-fns'
import { APPOINTMENT_STATUS } from '../../utils/constants'


export const Appointment = ({ onLongPress, patient, appointment, status }) => {
  const showEndTime = (status === APPOINTMENT_STATUS.lasts || status === APPOINTMENT_STATUS.future)
  return (
    <TouchableHighlight onLongPress={onLongPress}>
      <GroupItem status={status}>
        <Avatar.Text style={{ marginRight: 16 }} size={40} label={patient.fname[0] + (patient.lname[0] || '')} />
        <View style={{ flex: 1 }}>
          <FullName>{patient.fullName}</FullName>
          {Boolean(appointment.notes) && <GrayText>{appointment.notes}</GrayText>}
        </View>
        <BadgeWrapper>
          <Badge status={status}>{format(appointment.date, 'H:mm')}</Badge>
          {showEndTime && (
            <Badge status="green" size={25}>{format(addMinutes(appointment.date, appointment.duration), 'H:mm')}</Badge>
          )}
        </BadgeWrapper>
      </GroupItem>
    </TouchableHighlight>
  )
}

const FullName = styled.Text`
  font-weight: 600;
  font-size: 16px;
`

const BadgeWrapper = styled.View`
  flex-direction: column;
`

const GroupItem = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f3f3;
  background-color:${({ status }) => status === APPOINTMENT_STATUS.lasts ? '#daebd3' : 'white'};
`
