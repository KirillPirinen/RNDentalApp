import { Appointment } from "./Appointment"
import { Swipeable } from "react-native-gesture-handler"
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { SwipeViewButton } from "../Buttons"
import withObservables from '@nozbe/with-observables';
import { Animated, StyleSheet, View } from 'react-native'
import { useEffect, useRef } from "react"

const enhancer = withObservables(['appointment'], ({ appointment }) => ({
  appointment,
  patient: appointment.patient
}))

const noop = () => <View />

export const SwipeableAppointment = enhancer(({ 
  navigation, 
  appointment, 
  patient, 
  onDelete,
  onEdit,
  theme,
}) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const swipe = useRef(null).current
  const status = appointment.status
  const needsConfirmation = appointment.needsConfimation(status)

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
          onPress={() => {
            onEdit(appointment, patient)
            swipe?.close()
          }} 
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
          onPress={() => {
            onEdit(appointment, patient, true)
            swipe?.close()
          }}
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
      <Swipeable 
        renderRightActions={rightSwipeActions}
        renderLeftActions={needsConfirmation ? leftSwipeActions : noop}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        ref={swipe}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Appointment 
            appointment={appointment} 
            patient={patient}
            onLongPress={() => navigation.navigate('Detail', { patient })}
            status={status}
          >
            {needsConfirmation && <View style={styles.badgeLeft}>
              <Entypo name="arrow-bold-right" size={10} color="white" />
            </View>}
            <View style={[styles.badgeRight, { backgroundColor: theme.colors.backdrop }]}>
              <Entypo name="arrow-bold-left" size={10} color="white" />
            </View>
          </Appointment>
        </Animated.View>
      </Swipeable>
  )
})

const styles = StyleSheet.create({
  badgeLeft: {
    position: 'absolute',
    width: 10,
    height:50,
    backgroundColor:'green',
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    justifyContent: 'center',
    padding:0,
  },
  badgeRight: {
    position: 'absolute',
    width: 10,
    height:50,
    backgroundColor:'red',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    justifyContent: 'center',
    padding:0,
    right:0,
  }
})
