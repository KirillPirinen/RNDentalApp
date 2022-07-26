import withObservables from '@nozbe/with-observables'
import { SafeAreaView, StatusBar, SectionList } from 'react-native'
import styled from 'styled-components/native'
import { PlusButton, SwipeableAppointment, SectionTitle, ConfirmDelete } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb';
import { groupAppointments } from '../utils/groupAppointments'
import { useMemo, useCallback } from 'react'
import { useForceUpdateByInterval } from '../utils/custom-hooks/useForceUpdate'
import { defaultExtractor } from '../utils/defaultExtracror'
import { useModal } from '../context/modal-context'

const Container = styled.View`
  flex: 1;
`

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

  return (
    <Container>
      <StatusBar />
      <SafeAreaView>
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
      />
      </SafeAreaView>
      <PlusButton onPress={() => navigation.navigate('AddAppointment')}/>
    </Container>
  )
}

export default withDatabase(
  withObservables([], ({ database }) => ({
    appointments: database.get('appointments').query(
      Q.sortBy('date', Q.asc)
    ).observe()
  }))(Appointments),
);
