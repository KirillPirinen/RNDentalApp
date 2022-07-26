import Appointment from "./Appointment"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Ionicons } from '@expo/vector-icons'
import { SwipeViewButton } from "../Buttons"

const rightSwipeActions = () => (
  <>
    <SwipeViewButton style={{ backgroundColor: '#F85A5A' }}>
      <Ionicons name="ios-close" size={48} color="white" />
    </SwipeViewButton>
    <SwipeViewButton style={{ backgroundColor: '#B4C1CB' }}>
      <Ionicons name="md-create" size={28} color="white" />
    </SwipeViewButton>
  </>
)

export const SwipeableAppointment = (props) => (
  <GestureHandlerRootView>
    <Swipeable
      renderRightActions={rightSwipeActions}
    >
      <Appointment {...props} />
    </Swipeable>
  </GestureHandlerRootView>
)
