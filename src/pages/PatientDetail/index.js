import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Linking, StyleSheet, useWindowDimensions } from 'react-native'
import withObservables from '@nozbe/with-observables'
import { Text, useTheme } from 'react-native-paper'
import { Button, FAB, PhonesList, CallButton, WhatsappButton, TelegramButtom, ButtonRowPanel } from '../../components'
import { useGeneralControl } from '../../context/general-context'
import { useFabControlsRef } from '../../utils/custom-hooks/useSafeRef'
import { getPrimaryPhoneNumber } from '../../utils/getPrimaryPhoneNumber'
import AppointmentsListTab from './TabsContent/AppointmentsListTab'
import FilesTab from './TabsContent/FilesTab'

import { TabView, TabBar } from 'react-native-tab-view';

const tabs = [
  { key: 0, title: 'Записи' },
  { key: 1, title: 'Файлы' },
]

const PatientDetail = ({ navigation, patient, phones }) => {
  const [actions, dispatch] = useGeneralControl()
  const layout = useWindowDimensions();
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(true)
  
  const onDeletePatient = () => patient.deleteInstance().then(() => {
    dispatch({ type: actions.CLEAR })
    navigation.popToTop()
  })

  const onConfirmDeletePatient = () => dispatch({ 
    type: actions.CONFIRM_DELETE,
    payload: { patient, onDelete: onDeletePatient, mode: 'patient' }
  })

  const onCall = () => {
    Linking.openURL(`tel:${getPrimaryPhoneNumber(phones)}`).catch(() => {
      dispatch({ 
        type: actions.INFO,
        payload: { 
          text: 'К сожалению мы не смогли открыть приложение для звонка',
          color: 'errorContainer'
        }
      })
    })
  }

  const onSendMessage = (mode) => () => dispatch({ 
    type: actions.CHOOSE_TEMPLATE,
    payload: { patient, mode, phone: getPrimaryPhoneNumber(phones) }
  })

  const [ref, showFab, hideFab] = useFabControlsRef()

  useEffect(() => {
    
    const onWhatsappCheck = () => {
      patient.updateInstance({ hasWhatsapp: !patient.hasWhatsapp })
    }
    const onTelegramCheck = () => {
      patient.updateInstance({ hasTelegram: !patient.hasTelegram })
    }

    navigation.setOptions({
      menu: [{ 
        type: 'TouchableCheckbox', 
        title: 'Telegram', 
        onPress: onTelegramCheck,
        value: patient.hasTelegram
      },
      {
        type: 'TouchableCheckbox', 
        title: 'Whatsapp', 
        onPress: onWhatsappCheck,
        value: patient.hasWhatsapp
      },
      {
        type: 'TouchableCheckbox', 
        title: collapsed ? 'Скрыть информацию    ' : 'Показать информацию', 
        onPress: setCollapsed,
        value: collapsed
      }]
    })
  }, [patient, collapsed])

  const [index, setIndex] = React.useState(0);

  const renderScene = useCallback(({ route }) => {
    switch (route.key) {
      case 0:
        return <AppointmentsListTab 
          navigation={navigation} 
          patient={patient} 
          onScrollBeginDrag={hideFab} 
          onScrollEndDrag={showFab} 
        />;
      case 1:
        return <FilesTab patient={patient} />
    }
  }, [patient, showFab, hideFab]);

  const {
    onIndexChange,
    renderTabBar
  } = useMemo(() => {
    const renderLabel = ({ route, focused, color }) => <Text variant='titleMedium' style={{ color }}>{route.title}</Text>
    return {
      onIndexChange: (index) => {
        index === 0 ? showFab() : hideFab()
        setIndex(index)
      },
      renderTabBar: props => {
        return (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.surface, height: 3 }}
            style={{ backgroundColor: theme.colors.primary, height: 50 }}
            renderLabel={renderLabel}
          />
        )
      }
    }
  }, [showFab, hideFab])

  return (
      <View style={styles.pageWrapper}>
        <View style={[styles.patientDetails, !collapsed && { display: 'none' }]}>
          <View style={styles.metaWrapper}>
            <View style={styles.nameWrapper}>
              <Text style={styles.patientFullname}>
                {patient.fullName}
              </Text>
            </View>
            <ButtonRowPanel 
              onEdit={() => navigation.navigate('AddPatient', { patient, phones })}
              onDelete={onConfirmDeletePatient}
            />
          </View>
          <View style={styles.phoneListWrapper}>
            <PhonesList phones={phones} />
          </View>
          <View style={styles.patientButtons}>
            <View style={styles.formulaButtonView}>
              <Button onPress={() => navigation.navigate('TeethFormula', { patient })}>Зубная формула</Button>
            </View>
            <CallButton onPress={onCall} />
            {patient.hasWhatsapp && <WhatsappButton onPress={onSendMessage('whatsapp')} />}
            {patient.hasTelegram && <TelegramButtom onPress={onSendMessage('telegram')} />}
          </View>
        </View>
         <TabView
            initialLayout={{ width: layout.width }}
            navigationState={{ index, routes: tabs }}
            onIndexChange={onIndexChange}
            renderScene={renderScene}
            onSwipeStart={hideFab}
            renderTabBar={renderTabBar}
          />
        <FAB
          ref={ref} 
          label={`Записать пациента`}
          onPress={() => navigation.navigate('AddAppointment', { patient })}
        /> 
      </View>
  )
}

const styles = StyleSheet.create({
  patientListWrapper: { paddingHorizontal: 25 },
  pageWrapper: { flex: 1, zIndex: 100 },
  patientDetails: { maxHeight: 300, padding: 25 },
  formulaButtonView: { flex: 1 },
  patientButtons: { flexDirection: 'row', marginTop: 20 },
  nameWrapper: { flexShrink: 2 },
  patientFullname: {
    fontWeight:'800',
    fontSize: 24,
    lineHeight: 30,    
    marginBottom: 3
  },
  phoneListWrapper: { flexDirection: 'row', flexWrap:'wrap', justifyContent:'space-between' },
  metaWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  }
})

export default withObservables(['route'], ({ route }) => ({
    patient: route.params.patient,
    phones: route.params.patient.phones
}))(PatientDetail)
