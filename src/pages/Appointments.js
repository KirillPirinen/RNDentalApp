import withObservables from '@nozbe/with-observables'
import { SafeAreaView, StatusBar, FlatList } from 'react-native'
import styled from 'styled-components/native'
import { PlusButton, SwipeableAppointment, SectionTitle } from '../components'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'

const Container = styled.View`
  flex: 1;
`
const Separator = styled.View`
  height: 1;
  background-color: #F3F3F3;
  width: 80%;
`

const Appointments = ({ appointments, navigation }) => {
  return (
    <Container>
      <StatusBar />
      <SafeAreaView>
          {appointments?.map(day => (
            <>
              <SectionTitle>{day.date}</SectionTitle>
              <FlatList
                data={day.appointments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SwipeableAppointment 
                {...item}
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

export default Appointments
// export default withDatabase(
//   withObservables([], ({ database }) => ({
//     appointments: database.get('appointments').query()
//   }))(Appointments),
// );
