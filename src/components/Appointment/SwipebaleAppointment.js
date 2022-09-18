import { Appointment } from "./Appointment"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { SwipeViewButton } from "../Buttons"
import withObservables from '@nozbe/with-observables';
import { Animated, StyleSheet, View } from 'react-native'
import { useEffect, useRef } from "react"
import { APPOINTMENT_STATUS } from '../../utils/constants'
import Badge from "../Badge"
import { Text } from "react-native-paper"

const enhancer = withObservables(['appointment'], ({ appointment }) => ({
  appointment,
  patient: appointment.patient
}))

export const SwipeableAppointment = enhancer(({ 
  navigation, 
  appointment, 
  patient, 
  onDelete,
  onEdit,
  theme
}) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const status = appointment.status
  const isHistory = status === APPOINTMENT_STATUS.lasts || status === APPOINTMENT_STATUS.past
  const needsConfirmation = !appointment.isConfirmed && isHistory

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
        <SwipeViewButton 
          onPress={() => onDelete(appointment, patient)} 
          style={{ backgroundColor: theme.colors.error }}
        >
          <Ionicons name="ios-close" size={48} color="white"
          />
        </SwipeViewButton>
        <SwipeViewButton 
          onPress={() => onEdit(appointment, patient)} 
          style={{ backgroundColor: theme.colors.backdrop }}
        >
          <Ionicons name="md-create" size={28} color="white" />
        </SwipeViewButton>
      </>
    )
  }

  const leftSwipeActions = () => {
    return (
        <SwipeViewButton 
          onPress={() => onEdit(appointment, patient, true)} 
          style={{ backgroundColor: 'green' }}
        >
          <MaterialCommunityIcons 
            name="file-check-outline" 
            size={48}
            color="white"
          />
        </SwipeViewButton>
    )
  }

  return (
    <GestureHandlerRootView>
      <Swipeable 
        renderRightActions={rightSwipeActions}
        renderLeftActions={isHistory && leftSwipeActions}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Appointment 
            appointment={appointment} 
            patient={patient}
            onLongPress={() => navigation.navigate('Detail', { patient })}
            status={status}
          >
            {needsConfirmation && <View style={styles.badge}>
              <Entypo name="arrow-bold-right" size={12} color="white" />
            </View>}
          </Appointment>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  )
})

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    width: 13,
    height:50,
    backgroundColor:'green',
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    justifyContent: 'center',
    padding:0
  }
})
