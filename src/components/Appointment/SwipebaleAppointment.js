import { Appointment } from "./Appointment"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Ionicons } from '@expo/vector-icons'
import { SwipeViewButton } from "../Buttons"
import withObservables from '@nozbe/with-observables';
import { Animated } from 'react-native'
import { useEffect, useRef } from "react"

const enhancer = withObservables(['appointment'], ({ appointment }) => ({
  appointment,
  patient: appointment.patient
}))

export const SwipeableAppointment = enhancer(({ navigation, appointment, patient, onDelete }) => {
  const onEdit = () => navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const status = appointment.status

  useEffect(() => {
    fadeAnim.setValue(0)

    Animated.timing(
      fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start()

  }, [status, appointment])

  const rightSwipeActions = () => {
    return (
      <>
        <SwipeViewButton onPress={() => onDelete({ patient, appointment })} style={{ backgroundColor: '#F85A5A' }}>
          <Ionicons name="ios-close" size={48} color="white" />
        </SwipeViewButton>
        <SwipeViewButton onPress={onEdit} style={{ backgroundColor: '#B4C1CB' }}>
          <Ionicons name="md-create" size={28} color="white" />
        </SwipeViewButton>
      </>
    )
  }

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={rightSwipeActions}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Appointment 
            appointment={appointment} 
            patient={patient}
            onLongPress={() => navigation.navigate('Detail', { patient })}
            status={status}
          />
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  )
})
