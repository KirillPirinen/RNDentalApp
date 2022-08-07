import { Appointment } from "./Appointment"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Ionicons } from '@expo/vector-icons'
import { SwipeViewButton } from "../Buttons"
import withObservables from '@nozbe/with-observables';

const enhancer = withObservables(['appointment'], ({ appointment }) => ({
  appointment,
  patient: appointment.patient
}))

export const SwipeableAppointment = enhancer(({ appointment, patient }) => {

  const rightSwipeActions = () => {
    return (
      <>
        <SwipeViewButton onPress={() => appointment.deleteInstance()} style={{ backgroundColor: '#F85A5A' }}>
          <Ionicons name="ios-close" size={48} color="white" />
        </SwipeViewButton>
        <SwipeViewButton style={{ backgroundColor: '#B4C1CB' }}>
          <Ionicons name="md-create" size={28} color="white" />
        </SwipeViewButton>
      </>
    )
  }

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={rightSwipeActions}>
        <Appointment appointment={appointment} patient={patient} />
      </Swipeable>
    </GestureHandlerRootView>
  )
})
