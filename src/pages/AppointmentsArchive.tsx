import withObservables from '@nozbe/with-observables'
import { View, StyleSheet, FlatList } from 'react-native'
import { FAB, SwipeableAppointment, EmptyList, Autocomplete } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import {  useCallback, FC } from 'react'
import { renderDefaultDivider } from '../utils/defaultFn'
import { useGeneralControl } from '../context/general-context'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef';
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { NavigationProp } from '@react-navigation/native'
import Appointment from '../db/models/Appointment'
import Patient from '../db/models/Patient'
import { useAppTheme } from '../styles/themes'
import { Database, Q } from '@nozbe/watermelondb'
import { t } from '@lingui/macro'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { querySanitazer } from '../utils/sanitizers'

const spacer = <View style={{ height: 80 }} />

type AppointmentsArchiveProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  appointments: Array<Appointment>
}

const confirmIcon = <MaterialCommunityIcons name="archive-minus" size={48} color="white" />;

const AppointmentsArchive: FC<AppointmentsArchiveProps> = ({ appointments, navigation }) => {
  const [actions, dispatch] = useGeneralControl()

  const onEditAppointment = useCallback((appointment: Appointment, patient: Patient, confirm?: boolean) => {
    if (confirm) {
      return appointment.updateInstance({ isArchive: false });
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
  
  const renderList = useCallback(({ result, searchQuery: searchQueryRaw }: { result: Appointment[], searchQuery: string }) => {
    const theme = useAppTheme()
    const searchQuery = querySanitazer(searchQueryRaw)
    return (
      <FlatList
        data={result}
        renderItem={({ item }: { item: Appointment }) => (
          <SwipeableAppointment
            navigation={navigation}
            appointment={item}
            onEdit={onEditAppointment}
            onDelete={onConfirmDeleteAppointment}
            theme={theme}
            needsConfimation
            onConfirmIcon={confirmIcon}
            hightlight={searchQuery}
          />
        )}
        ItemSeparatorComponent={renderDefaultDivider}
        style={styles.wrapper}
        ListEmptyComponent={EmptyList}
        ListFooterComponent={spacer}
        onScrollBeginDrag={onDrag}
        onScrollEndDrag={onDrop}
      />
    )
  }, [navigation, theme, onEditAppointment, onConfirmDeleteAppointment])

  const onChange = useCallback(async (query: string) => {

    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return appointments
    }

    const acc = [];

    for (const appointment of appointments) {
      if (appointment.notes.toLowerCase().includes(normalized)) {
        acc.push(appointment)
        break;
      }

      const patient = await appointment.patient.fetch() as unknown as Patient;

      if(patient.fullName.toLowerCase().includes(normalized)) {
        acc.push(appointment)
      }
    }
    
    return acc;
  }, [appointments])

  const [ref, onDrop, onDrag] = useFabControlsRef()

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      {appointments.length ? (
        <Autocomplete 
          initState={appointments}
          renderList={renderList}
          onChange={onChange}
          barStyle={{ margin: 25, marginBottom: 10 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyList text={t`Архив пуст`} style={styles.emptyList} iconName='dots-horizontal' iconStyle={styles.emptyIcon} />
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
  wrapper: { height: '100%' },
})

export default withDatabase(
  withObservables([], ({ database }: { database: Database }) => ({
    appointments: database.get<Appointment>('appointments').query(Q.where('is_archive', true), Q.sortBy('date', Q.desc))
  }))(AppointmentsArchive),
)
