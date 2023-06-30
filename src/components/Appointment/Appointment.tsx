import { View, TouchableHighlight, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import GrayText from '../GrayText'
import Badge from '../Badge'
import { addMinutes, format } from 'date-fns'
import { APPOINTMENT_STATUS, AppotmentStatuses } from '../../consts'
import { Avatar } from '../Avatar'
import Patient from '../../db/models/Patient'
import AppointmentModel from '../../db/models/Appointment'
import { FC, ReactNode } from 'react'
import { useAppTheme } from '../../styles/themes'

export type AppointmentProps = {
  onLongPress: () => void;
  patient: Patient;
  appointment: AppointmentModel;
  status: AppotmentStatuses;
  children?: ReactNode
}

export const Appointment: FC<AppointmentProps> = ({ onLongPress, patient, appointment, status, children }) => {
  const showEndTime = (status === APPOINTMENT_STATUS.lasts || status === APPOINTMENT_STATUS.future)
  const theme = useAppTheme()
  const backgroundColor = status === APPOINTMENT_STATUS.lasts ? theme.colors.appointment.lasts : theme.colors.inverseOnSurface
  return (
    <TouchableHighlight onLongPress={onLongPress}>
      <View style={[styles.groupItem, { backgroundColor }]}>
        <Avatar fullName={patient.fullName} src={patient.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.fullName}>{patient.fullName}</Text>
          {Boolean(appointment.notes) && <GrayText>{appointment.notes}</GrayText>}
        </View>
        <View style={styles.badgeWrapper}>
          <Badge status={status}>{format(appointment.date, 'H:mm')}</Badge>
          {showEndTime && (
            <Badge status="green">{format(addMinutes(appointment.date, appointment.duration), 'H:mm')}</Badge>
          )}
        </View>
        {children}
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
