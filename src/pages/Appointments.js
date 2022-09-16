import withObservables from '@nozbe/with-observables'
import { View, SectionList, StatusBar } from 'react-native'
import { FAB, SwipeableAppointment, SectionTitle } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb';
import { groupAppointments } from '../utils/groupAppointments'
import { useMemo, useCallback, useRef } from 'react'
import { useForceUpdateByInterval } from '../utils/custom-hooks/useForceUpdate'
import { defaultExtractor } from '../utils/defaultExtracror'
import { useModal } from '../context/modal-context'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef';
import { useTheme } from 'react-native-paper';

const wrapperStyle = { height: '100%'}

const renderSectionHeader = ({ section: { day }}) => <SectionTitle>{day}</SectionTitle>

const Appointments = ({ appointments, navigation }) => {

  const [actions, dispatch] = useModal()

  const grouped = useMemo(() => groupAppointments(appointments), [appointments])

  useForceUpdateByInterval(10000)

  const onEditAppointment = useCallback((appointment, patient) => 
    navigation.navigate('AddAppointment', { patient, appointment, edit: true }), [])

  const onConfirmDeleteAppointment = useCallback((appointment, patient) => {
    const onDelete = () => appointment.deleteInstance().then(dispatch.bind(null, { type: actions.CLEAR }))
    dispatch({ 
      type: actions.CONFIRM_DELETE,
      payload: { patient, appointment, onDelete, mode: 'appointment' }
    })
  }, [])

  const [ref, onDrop, onDrag] = useFabControlsRef()
  const theme = useTheme()
  return (
    <View style={wrapperStyle}>
        <SectionList
          sections={grouped}
          keyExtractor={defaultExtractor}
          renderItem={({ item }) => <SwipeableAppointment
          navigation={navigation}
          appointment={item}
          onEdit={onEditAppointment}
          onDelete={onConfirmDeleteAppointment}
          theme={theme}
        />} 
          renderSectionHeader={renderSectionHeader}
          onScrollBeginDrag={onDrag}
          onScrollEndDrag={onDrop}
        />
        <FAB 
          ref={ref} 
          label="Добавить запись" 
          onPress={() => navigation.navigate('AddAppointment')}
        />
    </View>
  )
}

export default withDatabase(
  withObservables([], ({ database }) => ({
    appointments: database.get('appointments').query(
      Q.sortBy('date', Q.asc)
    ).observe()
  }))(Appointments),
);
