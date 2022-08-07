import withObservables from '@nozbe/with-observables'
import { SafeAreaView, StatusBar, SectionList } from 'react-native'
import styled from 'styled-components/native'
import { PlusButton, SwipeableAppointment, SectionTitle } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb';
import { groupAppointments } from '../utils/groupAppointments'

const Container = styled.View`
  flex: 1;
`
const Separator = styled.View`
  height: 1;
  background-color: #F3F3F3;
  width: 80%;
`

const Appointments = ({ appointments, navigation }) => {
  
  const grouped = groupAppointments(appointments)
  
  return (
    <Container>
      <StatusBar />
      <SafeAreaView>
      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SwipeableAppointment
        appointment={item}
        onLongPress={() => navigation.navigate('Detail')}
        />} 
        renderSectionHeader={({ section: { day }}) => (
          <SectionTitle>{day}</SectionTitle>
        )}
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
