import withObservables from '@nozbe/with-observables'
import { SafeAreaView, StatusBar, FlatList } from 'react-native'
import styled from 'styled-components/native'
import { PlusButton, SwipeableAppointment, SectionTitle } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb';
import { reduce } from 'rxjs/operators'
import { groupAppointments } from '../utils/groupAppointments'
import formatRu from '../utils/formatRu'

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
  
  console.log(grouped.length)

  return (
    <Container>
      <StatusBar />
      <SafeAreaView>
          {grouped?.map(day => (
            <>
              <SectionTitle>{formatRu(day[0].date, 'do MMMM, EEEE')}</SectionTitle>
              <FlatList
                data={day}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SwipeableAppointment
                onLongPress={() => navigation.navigate('Detail')}
                />} 
                ItemSeparatorComponent={() => <Separator />}
              />
            </>
            ))}
      </SafeAreaView>
      <PlusButton onPress={() => navigation.navigate('AddAppointment')}/>
    </Container>
  )
}

export default withDatabase(
  withObservables([], ({ database }) => ({
    appointments: database.get('appointments').query(
      //Q.unsafeSqlQuery(`select * from appointments`)
    ).observe()
  }))(Appointments),
);
