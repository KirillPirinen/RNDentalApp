import { View, TouchableHighlight, StyleSheet } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import GrayText from '../GrayText'
import Badge from '../Badge'
import { addMinutes, format } from 'date-fns'
import { APPOINTMENT_STATUS } from '../../utils/constants'
import { Avatar } from '../Avatar'
//'#daebd3'
export const Appointment = ({ onLongPress, patient, appointment, status }) => {
  const showEndTime = (status === APPOINTMENT_STATUS.lasts || status === APPOINTMENT_STATUS.future)
  const theme = useTheme()
  const backgroundColor = status === APPOINTMENT_STATUS.lasts ? theme.colors.primaryContainer : theme.colors.inverseOnSurface
  return (
    <TouchableHighlight onLongPress={onLongPress}>
      <View style={[styles.groupItem, { backgroundColor }]}>
        <Avatar fullName={patient.fullName} />
        <View style={{ flex: 1 }}>
          <Text style={styles.fullName}>{patient.fullName}</Text>
          {Boolean(appointment.notes) && <GrayText>{appointment.notes}</GrayText>}
        </View>
        <View style={styles.badgeWrapper}>
          <Badge status={status}>{format(appointment.date, 'H:mm')}</Badge>
          {showEndTime && (
            <Badge status="green" size={25}>{format(addMinutes(appointment.date, appointment.duration), 'H:mm')}</Badge>
          )}
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  fullName: {
    fontWeight: '600',
    fontSize: 16
  },
  badgeWrapper: {
    flexDirection: 'column'
  },
  groupItem: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  }
})
