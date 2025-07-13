import withObservables from '@nozbe/with-observables'
import { View, SectionList, StyleSheet } from 'react-native'
import { FAB, SwipeableAppointment, SectionTitle, EmptyList } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { groupAppointments } from '../utils/groupAppointments'
import { useMemo, useCallback, FC } from 'react'
import { useForceUpdateByInterval } from '../utils/custom-hooks/useForceUpdate'
import { defaultExtractor } from '../utils/defaultFn'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef';
import { appointmentsByDays } from '../db/raw-queries'
import { switchMap } from 'rxjs/operators'
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { extractSetting } from '../utils/hoc/withSetting'
import { NavigationProp } from '@react-navigation/native'
import Appointment from '../db/models/Appointment'
import Patient from '../db/models/Patient'
import { useAppTheme } from '../styles/themes'
import { Database } from '@nozbe/watermelondb'
import { NamedSetting } from '../db/models/Settings'
import { Button } from 'react-native-paper'
import { Trans, t } from '@lingui/macro'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const spacer = <View style={{ height: 80 }} />
const renderSectionHeader = ({ section: { day }}: { section: { day: string }}) => <SectionTitle>{day}</SectionTitle>

type AppointmentsProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  appointments: Array<Appointment>
}

const Appointments: FC<AppointmentsProps> = ({ appointments, navigation }) => {
  const grouped = useMemo(() => groupAppointments(appointments), [appointments])

  useForceUpdateByInterval(10000, !appointments.length)

  const onEditAppointment = useCallback((appointment: Appointment, patient: Patient, confirm?: boolean) => {
    if (confirm) {
      return navigation.navigate('ConfirmAppointment', { patient, appointment })
    }
    return navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  }, [])

  const onArchive = useCallback((appointment: Appointment) => {
    appointment.updateInstance({ isArchive: true });
  }, [])

  const theme = useAppTheme()
  
  const renderItem = useCallback(({ item }: { item: Appointment }) => <SwipeableAppointment
    navigation={navigation}
    appointment={item}
    onEdit={onEditAppointment}
    onDelete={onArchive}
    theme={theme}
    onDeleteIcon={<MaterialCommunityIcons name="archive-plus" size={48} color="white" />}
    
  />, [navigation, theme, onEditAppointment, onArchive])

  const [ref, onDrop, onDrag] = useFabControlsRef()

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <Button
        icon="calendar"
        labelStyle={{ fontSize: 18 }}
        style={{ padding: 0, marginTop: 5, marginBottom: 0 }}
        onPress={() => navigation.navigate('AppointmentsCalendar')}
      ><Trans>Открыть календарь</Trans></Button>
      {grouped.length ? (
        <SectionList
          sections={grouped}
          keyExtractor={defaultExtractor}
          renderItem={renderItem} 
          renderSectionHeader={renderSectionHeader}
          onScrollBeginDrag={onDrag}
          onScrollEndDrag={onDrop}
          ListFooterComponent={spacer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyList text={t`Записей нет`} style={styles.emptyList} iconName='dots-horizontal' iconStyle={styles.emptyIcon} />
        </View>
      )}
      <FAB 
        ref={ref} 
        label={t`Добавить запись`} 
        onPress={() => navigation.navigate('AddAppointment')}
      />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  emptyList: { marginTop: 30, width: '100%' },
  emptyContainer: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { backgroundColor: 'lightblue', marginBottom: 10 },
  wrapper: { height: '100%' }
})

export default withDatabase(
  withObservables([], ({ database }: { database: Database }) => ({
    appointments: extractSetting(
      database, 'trackingInterval', 
      switchMap((trackingInterval: NamedSetting<'trackingInterval'>) => {
        return database
        .get<Appointment>('appointments')
          .query(appointmentsByDays(trackingInterval.value))
            .observeWithColumns(['date'])
        }
      ))
      // @ts-ignore
  }))(Appointments),
)
