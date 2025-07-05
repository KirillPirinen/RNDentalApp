import React, { FC, useCallback } from 'react'
import { FlatList, FlatListProps, View } from 'react-native'
import { useTheme, Text } from 'react-native-paper'
import { PatientAppointment } from './Appointment/PatientAppointments'
import { defaultExtractor } from '../utils/defaultFn'
import withObservables from '@nozbe/with-observables'
import Appointment from '../db/models/Appointment'
import Patient from '../db/models/Patient'
import { NavigationProp } from '@react-navigation/native'
import { Trans } from '@lingui/react/macro'

export type PatientAppointmentListProps = Omit<FlatListProps<Appointment>, 'data' | 'renderItem'> & {
  appointments: Array<Appointment>;
  patient: Patient;
  setOpenedMenu: () => void;
  openedMenu: string;
  navigation: NavigationProp<ReactNavigation.RootParamList>
}

const ObservablePatientAppointment = withObservables(['appointment'], ({ appointment }) => ({
  appointment
}))(PatientAppointment)

export const PatientAppointmentList: FC<PatientAppointmentListProps> = ({ 
  appointments, 
  setOpenedMenu, 
  openedMenu,
  navigation,
  patient,
  ...rest
}) => {
  const theme = useTheme()

  const onEditAppointment = useCallback((appointment: Appointment, isConfirmation: boolean) => {
      if(isConfirmation) {
        return navigation.navigate('ConfirmAppointment', { patient, appointment, edit: true })
      }
      navigation.navigate('AddAppointment', { patient, appointment, edit: true })
  }, [patient])

  const onArchive = useCallback((appointment: Appointment) => {
    appointment.updateInstance({ isArchive: !appointment.isArchive });
  }, [])

  const renderAppointments = ({ item }: { item: Appointment }) => {
    return (
      <ObservablePatientAppointment 
        appointment={item}
        setOpenedMenu={setOpenedMenu}
        isMenuOpen={openedMenu === item.id}
        onEditAppointment={onEditAppointment}
        onArchiveAppointment={onArchive}
        theme={theme}
      />
    )
  }

  return (
    <View style={{ height: '90%' }}>
      {!appointments?.length && <Text style={{ marginTop: 12, textAlign: 'center', width: '100%' }}><Trans>Записей нет</Trans></Text>}
      <FlatList
        data={appointments}
        renderItem={renderAppointments}
        keyExtractor={defaultExtractor}
        contentContainerStyle={{ paddingBottom: 100 }}
        {...rest}
      />
    </View>
  )
}
