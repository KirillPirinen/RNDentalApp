import withObservables from '@nozbe/with-observables'
import { SafeAreaView, View, StatusBar, SectionList } from 'react-native'
import styled from 'styled-components/native'
import { FAB, SwipeableAppointment, SectionTitle } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb';
import { groupAppointments } from '../utils/groupAppointments'
import { useMemo, useCallback, useRef } from 'react'
import { useForceUpdateByInterval } from '../utils/custom-hooks/useForceUpdate'
import { defaultExtractor } from '../utils/defaultExtracror'
import { useModal } from '../context/modal-context'

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
      type: actions.CONFIRM_DELETE_APPOINTMENT,
      payload: { patient, appointment, onDelete }
    })
  }, [])

  const buttonControls = useRef()

  const onDrug = () => buttonControls.current?.(false)

  const onDrop = () => buttonControls.current?.(true)

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
        />} 
          renderSectionHeader={renderSectionHeader}
          onScrollBeginDrag={onDrug}
          onScrollEndDrag={onDrop}
        />
        <FAB 
          ref={buttonControls} 
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
