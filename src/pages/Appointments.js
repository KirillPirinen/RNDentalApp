import withObservables from '@nozbe/with-observables'
import { SafeAreaView, StatusBar, FlatList } from 'react-native'
import styled from 'styled-components/native'
import { PlusButton, SwipeableAppointment, SectionTitle } from '../components'
import { getAppointmentsByDay } from '../redux/appointmentSlice'
import { useNavigation } from '@react-navigation/native'
import { database } from '../db'
import { useEffect } from 'react'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'

const Container = styled.View`
  flex: 1;
`
const Separator = styled.View`
  height: 1;
  background-color: #F3F3F3;
  width: 80%;
`

const Appointments = ({ patients, navigation }) => {
  const days = []
  return (
    <Container>
      <StatusBar />
      <SafeAreaView>
          {days.map(day => (
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

export default withDatabase(
  withObservables([], ({ database }) => ({
    patients: database.collections.get('patients').query().observeCount(),
  }))(Appointments),
);
