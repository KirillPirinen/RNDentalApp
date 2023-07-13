import withObservables from '@nozbe/with-observables'
import { View, SectionList } from 'react-native'
import { FAB, SwipeableAppointment, SectionTitle } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { groupAppointments } from '../utils/groupAppointments'
import { useMemo, useCallback, FC } from 'react'
import { useForceUpdateByInterval } from '../utils/custom-hooks/useForceUpdate'
import { defaultExtractor } from '../utils/defaultFn'
import { useGeneralControl } from '../context/general-context'
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

const wrapperStyle = { height: '100%'} as const

const renderSectionHeader = ({ section: { day }}: { section: { day: string }}) => <SectionTitle>{day}</SectionTitle>

type AppointmentsProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  appointments: Array<Appointment>
}

const Appointments: FC<AppointmentsProps> = ({ appointments, navigation }) => {

  const [actions, dispatch] = useGeneralControl()

  const grouped = useMemo(() => groupAppointments(appointments), [appointments])

  useForceUpdateByInterval(10000, !appointments.length)

  const onEditAppointment = useCallback((appointment: Appointment, patient: Patient, confirm?: boolean) => {
    if(confirm) {
      return navigation.navigate('ConfirmAppointment', { patient, appointment })
    }
    return navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  }, [])

  const onConfirmDeleteAppointment = useCallback((appointment: Appointment, patient: Patient) => {
    const onDelete = () => appointment.deleteInstance().then(dispatch.bind(null, { type: actions.CLEAR }))
    dispatch({ 
      type: actions.CONFIRM_DELETE,
      payload: { patient, appointment, onDelete, mode: 'appointment' }
    })
  }, [])

  const theme = useAppTheme()
  
  const renderItem = useCallback(({ item }: { item: Appointment }) => <SwipeableAppointment
    navigation={navigation}
    appointment={item}
    onEdit={onEditAppointment}
    onDelete={onConfirmDeleteAppointment}
    theme={theme}
  />, [navigation, theme, onEditAppointment, onConfirmDeleteAppointment])

  const [ref, onDrop, onDrag] = useFabControlsRef()

  return (
    <GestureHandlerRootView style={wrapperStyle}>
        <SectionList
          sections={grouped}
          keyExtractor={defaultExtractor}
          renderItem={renderItem} 
          renderSectionHeader={renderSectionHeader}
          onScrollBeginDrag={onDrag}
          onScrollEndDrag={onDrop}
          ListFooterComponent={<View style={{ height: 80 }}></View>}
        />
        <FAB 
          ref={ref} 
          label="Добавить запись" 
          onPress={() => navigation.navigate('AddAppointment')}
        />
    </GestureHandlerRootView>
  )
}

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
