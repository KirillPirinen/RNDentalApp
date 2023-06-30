import { StyleSheet, View } from 'react-native'
import { Foundation, FontAwesome5 } from '@expo/vector-icons'
import { Text, Menu, IconButton, Divider, Surface, MenuProps } from 'react-native-paper'
import Badge from '../Badge'
import formatRu from '../../utils/formatRu'
import { FC, ReactNode, memo, useState } from 'react'
import Appointment from '../../db/models/Appointment'
import { AppTheme } from '../../styles/themes'

type AppointmentHandler = (app: Appointment, isConfirmation?: boolean) => void

export type PatientAppointmentProps = {
  appointment: Appointment;
  theme: AppTheme;
  onEditAppointment?: MenuApointmentProps['onEditAppointment'];
  onDeleteAppointment?: MenuApointmentProps['onDeleteAppointment'],
}

export const PatientAppointment: FC<PatientAppointmentProps> = ({ 
  appointment, 
  onEditAppointment, 
  onDeleteAppointment,
  theme: { colors }
}) => {
  const hasMenu = onEditAppointment && onDeleteAppointment
  return (
    <Surface 
      style={[
        styles.card, 
        { backgroundColor: colors.patientAppointment.background }
      ]} 
      elevation={1}
    >
      <View style={{ 
          marginTop: hasMenu ? -25 : 20,  
          flexDirection:'row-reverse'
        }}>
        {hasMenu && <MenuApointment 
          appointment={appointment}
          onEditAppointment={onEditAppointment}
          onDeleteAppointment={onDeleteAppointment}
          contentStyle={{ backgroundColor: colors.patientAppointment.background }}
        />}
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
      {Boolean(appointment.price) && <Badge style={styles.badgePrice} status="green">{appointment.price} &#8381;</Badge>}
    </Surface>
  )
}

const Teeth: FC<{ teeth: string }> = ({ teeth }) => {
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

const Diagnosis: FC<{ diagnosis: string }> = ({ diagnosis }) => (
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

const Notes: FC<{ notes: string }> = ({ notes }) => (
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

export type MenuApointmentProps = Partial<Omit<MenuProps, 'visible' | 'anchor' >> & {
  appointment: Appointment;
  onEditAppointment: AppointmentHandler;
  onDeleteAppointment: AppointmentHandler;
}

const MenuApointment: FC<MenuApointmentProps> = ({ onEditAppointment, appointment, onDeleteAppointment, ...rest }) => {
  const [visible, setVisible] = useState(false)
  const hof = (fn: AppointmentHandler, isConfirmation?: boolean) => () => (setVisible(false), fn(appointment, isConfirmation))
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<IconButton 
        onPress={() => setVisible(true)}
        icon="menu"
        size={20}
      />}
      {...rest}
    >
      <Menu.Item onPress={hof(onDeleteAppointment)} title="Удалить" />
      <Divider bold />
      <Menu.Item onPress={hof(onEditAppointment)} title="Изменить время" />
      <Divider bold />
      <Menu.Item onPress={hof(onEditAppointment, true)} title={!appointment.isConfirmed ? "Подтвердить прием" : "Редактировать"} />
    </Menu>
  )
}

export default memo(PatientAppointment)

const AppointmentCardLabel: FC<{ children: ReactNode }> = ({ children }) => <Text style={styles.appointmentCardLabel}>{children}</Text>

const AppointmentCardRow: FC<{ style?:object, children: ReactNode }> = ({ style, children }) => <View style={style ? [styles.appointmentCardRow, style]: styles.appointmentCardRow}>{children}</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor:'white',
    borderRadius: 10,
    padding: 20,
    marginVertical: 5,
    borderColor:'#dddddd',
    borderWidth:1,
  },
  badgePrice: {
    position: 'absolute',
    width: 'auto',
    paddingHorizontal: 5,
    top: -6,
    left: 0,
    zIndex: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7da453'
  },
  appointmentCardLabel: {
    fontSize: 16,
    marginLeft: 10
  },
  appointmentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3.5,
    marginBottom: 3.5,
  }
})