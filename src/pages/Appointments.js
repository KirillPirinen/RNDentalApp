import withObservables from '@nozbe/with-observables'
import { SafeAreaView, StatusBar, SectionList } from 'react-native'
import styled from 'styled-components/native'
import { PlusButton, SwipeableAppointment, SectionTitle, ConfirmDelete } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb';
import { groupAppointments } from '../utils/groupAppointments'
import { useEffect, useState, useMemo } from 'react'
import formatRu from '../utils/formatRu'
import { useForceUpdate } from '../utils/custom-hooks/useForceUpdate'

const Container = styled.View`
  flex: 1;
`

const renderSectionHeader = ({ section: { day }}) => <SectionTitle>{day}</SectionTitle>
const keyExtractor = (item) => item.id

const Appointments = ({ appointments, navigation }) => {
  const [modalContent, setModalContent] = useState(null)

  const grouped = useMemo(() => groupAppointments(appointments), [appointments])

  const forceRerender = useForceUpdate()

  useEffect(() => {

    const timer = setInterval(forceRerender, 30000)

    return () => clearInterval(timer)

  }, [appointments])

  const onDelete = () => (modalContent.appointment.deleteInstance(), setModalContent(null))
  return (
    <Container>
      <StatusBar />
      <SafeAreaView>
      <SectionList
        sections={grouped}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <SwipeableAppointment
        navigation={navigation}
        appointment={item}
        onDelete={setModalContent}
      />} 
        renderSectionHeader={renderSectionHeader}
      />
      </SafeAreaView>
      <PlusButton onPress={() => navigation.navigate('AddAppointment')}/>
      {modalContent && <ConfirmDelete 
        visible={true} 
        title={`Удаление записи пациента ${modalContent.patient.fullName}`}
        question={`Вы действительно хотите удалить запись на ${formatRu(modalContent.appointment.date, 'PPpp')}?`}
        onClose={() => setModalContent(null)}
        onDelete={onDelete}
      /> }
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
