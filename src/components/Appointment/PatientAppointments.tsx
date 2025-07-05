import { StyleSheet, View } from 'react-native'
import { Foundation, FontAwesome5 } from '@expo/vector-icons'
import { Text, Menu, IconButton, Divider, Surface, MenuProps } from 'react-native-paper'
import Badge from '../Badge'
import formatRu, { formatPrice } from '../../utils/formatLocalized'
import { FC, ReactNode, memo, useState } from 'react'
import Appointment from '../../db/models/Appointment'
import { AppTheme } from '../../styles/themes'
import { plural, t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'

type AppointmentHandler = (app: Appointment, isConfirmation?: boolean) => void

export type PatientAppointmentProps = {
  appointment: Appointment;
  theme: AppTheme;
  onEditAppointment?: MenuApointmentProps['onEditAppointment'];
  onArchiveAppointment?: MenuApointmentProps['onArchiveAppointment'],
}

export const PatientAppointment: FC<PatientAppointmentProps> = ({ 
  appointment, 
  onEditAppointment, 
  onArchiveAppointment,
  theme: { colors }
}) => {
  const hasMenu = onEditAppointment && onArchiveAppointment
  return (
    <Surface 
      style={[
        styles.card, 
        { backgroundColor: appointment.isArchive ? colors.patientAppointment.backgroundArchive : colors.patientAppointment.background }
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
          onArchiveAppointment={onArchiveAppointment}
          contentStyle={{ backgroundColor: colors.patientAppointment.background }}
        />}
      </View>
      <AppointmentCardRow style={{ marginTop: -20 }}>
        <FontAwesome5 name="clock" size={16} color="#A3A3A3" />
        <AppointmentCardLabel>
         {`${t`Длительность`}: `}
          <Text style={{ fontWeight: '600' }}>
            {`${appointment.duration} ${t`минут`}`}
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
        {appointment.isArchive && (
          <Badge status="archive">
            <Trans>В архиве</Trans>
          </Badge>
        )}
      </AppointmentCardRow>
      {Boolean(appointment.price) && <Badge style={styles.badgePrice} status="green">{formatPrice(appointment.price)}</Badge>}
    </Surface>
  )
}

const Teeth: FC<{ teeth: string }> = ({ teeth }) => {
  const count = teeth.split(',')
  return (
    <AppointmentCardRow>
      <FontAwesome5 name="tooth" size={16} color="#A3A3A3" />
      <AppointmentCardLabel>
        {plural(count?.length ?? 0, { one: 'Зуб', other: 'Зубы' })}:
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
      {`${t`Диагноз`}: `}
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
      {t`Заметки`}:{' '}
      <Text style={{ fontWeight: '600' }}>{notes}</Text>
    </AppointmentCardLabel>
  </AppointmentCardRow>
)

export type MenuApointmentProps = Partial<Omit<MenuProps, 'visible' | 'anchor' >> & {
  appointment: Appointment;
  onEditAppointment: AppointmentHandler;
  onArchiveAppointment: AppointmentHandler;
}

const MenuApointment: FC<MenuApointmentProps> = ({ onEditAppointment, appointment, onArchiveAppointment, ...rest }) => {
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
      <Menu.Item onPress={hof(onArchiveAppointment)} title={appointment.isArchive ? t`Достать из архива` : t`В архив`} />
      <Divider bold />
      <Menu.Item onPress={hof(onEditAppointment)} title={t`Изменить время`} />
      <Divider bold />
      <Menu.Item onPress={hof(onEditAppointment, true)} title={!appointment.isConfirmed ? t`Подтвердить прием` : t`Редактировать`} />
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
