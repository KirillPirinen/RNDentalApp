import { Appointment } from "./Appointment"
import { Swipeable } from "react-native-gesture-handler"
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { SwipeViewButton } from "../Buttons"
import withObservables from '@nozbe/with-observables';
import { Animated, StyleSheet, View } from 'react-native'
import { FC, useEffect, useRef } from "react"
import { NavigationProp } from "@react-navigation/native";
import AppointmentModel from "../../db/models/Appointment";
import Patient from "../../db/models/Patient";
import { AppTheme } from "../../styles/themes";
import { AppotmentStatuses } from "../../consts";

export type SwipeableAppointmentProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  appointment: AppointmentModel;
  onDelete: (appointment: AppointmentModel, patient: Patient) => void;
  onEdit: (appointment: AppointmentModel, patient: Patient, isEdit?: boolean) => void;
  theme: AppTheme;
  onDeleteIcon?: React.ReactNode;
  onConfirmIcon?: React.ReactNode;
  needsConfimation?: boolean;
  hightlight?: string;
}

const enhancer = withObservables(['appointment'], ({ appointment }) => ({
  appointment,
  patient: appointment.patient
}))

const noop = () => <View />

export const SwipeableAppointment: FC<SwipeableAppointmentProps> = enhancer(({ 
  navigation, 
  appointment, 
  patient, 
  onDelete,
  onEdit,
  theme,
  onDeleteIcon,
  onConfirmIcon,
  needsConfimation,
  hightlight
}: SwipeableAppointmentProps & { patient: Patient }) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const swipe = useRef<null | Swipeable>(null)
  const status = appointment.status as AppotmentStatuses
  const needsConfirmation = needsConfimation || appointment.needsConfimation(status)

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
          {onDeleteIcon || <Ionicons name="ios-close" size={48} color="white" />}
        </SwipeViewButton>
        <SwipeViewButton 
          onPress={() => {
            onEdit(appointment, patient)
            swipe.current?.close()
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
            swipe.current?.close()
          }}
          style={{ backgroundColor: 'green' }}
        >
          {onConfirmIcon || <MaterialCommunityIcons 
            name="file-check-outline" 
            size={48}
            color="white"
          />}
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
            hightlight={hightlight}
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
