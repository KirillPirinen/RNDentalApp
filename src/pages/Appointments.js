import { useSelector } from 'react-redux'
import { SafeAreaView, StatusBar, FlatList } from 'react-native'
import styled from 'styled-components/native'
import { PlusButton, SwipeableAppointment, SectionTitle } from '../components'
import { getAppointmentsByDay } from '../redux/appointmentSlice'
import { useNavigation } from '@react-navigation/native'

const Container = styled.View`
  flex: 1;
`
const Separator = styled.View`
  height: 1;
  background-color: #F3F3F3;
  width: 80%;
`

export const Appointments = () => {
  const days = useSelector(getAppointmentsByDay)
  const navigation = useNavigation()
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
