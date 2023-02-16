import withObservables from '@nozbe/with-observables'
import { View, SectionList } from 'react-native'
import { FAB, SwipeableAppointment, SectionTitle } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { groupAppointments } from '../utils/groupAppointments'
import { useMemo, useCallback } from 'react'
import { useForceUpdateByInterval } from '../utils/custom-hooks/useForceUpdate'
import { defaultExtractor } from '../utils/defaultFn'
import { useGeneralControl } from '../context/general-context'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef';
import { useTheme } from 'react-native-paper';
import { appointmentsByDays } from '../db/raw-queries'
import { switchMap } from 'rxjs/operators'
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { extractSetting } from '../utils/hoc/withSetting'

const wrapperStyle = { height: '100%'}

const renderSectionHeader = ({ section: { day }}) => <SectionTitle>{day}</SectionTitle>

const Appointments = ({ appointments, navigation }) => {

  const [actions, dispatch] = useGeneralControl()

  const grouped = useMemo(() => groupAppointments(appointments), [appointments])

  useForceUpdateByInterval(10000, !appointments.length)

  const onEditAppointment = useCallback((appointment, patient, confirm) => {
    if(confirm) {
      return navigation.navigate('ConfirmAppointment', { patient, appointment })
    }
    return navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  }, [])

  const onConfirmDeleteAppointment = useCallback((appointment, patient) => {
    const onDelete = () => appointment.deleteInstance().then(dispatch.bind(null, { type: actions.CLEAR }))
    dispatch({ 
      type: actions.CONFIRM_DELETE,
      payload: { patient, appointment, onDelete, mode: 'appointment' }
    })
  }, [])

  const renderItem = useCallback(({ item }) => <SwipeableAppointment
    navigation={navigation}
    appointment={item}
    onEdit={onEditAppointment}
    onDelete={onConfirmDeleteAppointment}
    theme={theme}
  />, [navigation, theme, onEditAppointment, onConfirmDeleteAppointment])

  const [ref, onDrop, onDrag] = useFabControlsRef()
  const theme = useTheme()

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
  withObservables([], ({ database }) => ({
    appointments: extractSetting(
      database, 'trackingInterval', 
      switchMap((trackingInterval) => {
        return database
        .get('appointments')
          .query(appointmentsByDays(trackingInterval.value))
            .observeWithColumns(['date'])
        }
        ))
  }))(Appointments),
)
