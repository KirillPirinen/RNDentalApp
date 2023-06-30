import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { View, Linking, StyleSheet, useWindowDimensions, Image } from 'react-native'
import withObservables from '@nozbe/with-observables'
import { Text, useTheme } from 'react-native-paper'
import { Button, FAB, PhonesList, CallButton, WhatsappButton, TelegramButton, ButtonRowPanel } from '../../components'
import { useGeneralControl, useSettings } from '../../context/general-context'
import { useFabControlsRef } from '../../utils/custom-hooks/useSafeRef'
import { getPrimaryPhoneNumber } from '../../utils/getPrimaryPhoneNumber'
import AppointmentsListTab from './TabsContent/AppointmentsListTab'
import FilesTab from './TabsContent/FilesTab'

import { TabView, TabBar, Route } from 'react-native-tab-view';

import { CONTACT_SYNC_STRATEGY } from '../../consts'
import { NavigationProp } from '@react-navigation/native'
import Patient from '../../db/models/Patient'
import Phone from '../../db/models/Phone'
import { ChooseTemplateProps } from '../../components/PortalContent/ChooseTemplate'

const tabs: Array<Route> = [
  { key: '0', title: 'Записи' },
  { key: '1', title: 'Файлы' },
]

export type PatientDetailProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  patient: Patient;
  phones: Phone[];
}

const PatientDetail: FC<PatientDetailProps> = ({ navigation, patient, phones }) => {
  const [actions, dispatch] = useGeneralControl()
  const { sync } = useSettings()
  const layout = useWindowDimensions();
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(true)
  
  useEffect(() => {
    if(patient?.contactId && sync.contactStrategyType !== CONTACT_SYNC_STRATEGY.never) {
      patient.getSyncBatches().then(batches => {
        if(sync.contactStrategyType === CONTACT_SYNC_STRATEGY.ask && batches?.length) {
          return dispatch({ type: actions.CHOOSE_SYNC, payload: {
            onSync: () => patient.syncWithContact(batches).finally(() => {
              dispatch({ type: actions.CLEAR })
            })
          }})
        }
        // autosync
        patient.syncWithContact(batches)
      })
    }
  }, [patient?.contactId])

  const onDeletePatient = () => patient.deleteInstance().then(() => {
    dispatch({ type: actions.CLEAR })
    // @ts-ignore
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

  const onSendMessage = (mode: ChooseTemplateProps['mode']) => () => dispatch({ 
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
        label: 'Telegram', 
        onPress: onTelegramCheck,
        value: patient.hasTelegram
      },
      {
        type: 'TouchableCheckbox', 
        label: 'Whatsapp', 
        onPress: onWhatsappCheck,
        value: patient.hasWhatsapp
      },
      {
        type: 'TouchableCheckbox', 
        label: collapsed ? 'Скрыть информацию    ' : 'Показать информацию', 
        onPress: setCollapsed,
        value: collapsed
      }]
    })
  }, [patient, collapsed])

  const [index, setIndex] = React.useState(0);

  const renderScene = useCallback(({ route }: { route: typeof tabs[number] }) => {
    switch (route.key) {
      case '0':
        return <AppointmentsListTab 
          navigation={navigation} 
          patient={patient} 
          onScrollBeginDrag={hideFab} 
          onScrollEndDrag={showFab} 
        />;
      case '1':
        return <FilesTab patient={patient} setCollapsed={setCollapsed} />
    }
  }, [patient, showFab, hideFab, setCollapsed]);

  const {
    onIndexChange,
    renderTabBar
  } = useMemo(() => {
    return {
      onIndexChange: (index: number) => {
        index === 0 ? showFab() : hideFab()
        setIndex(index)
      },
      renderTabBar: (props: any) => {
        return (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.surface, height: 3 }}
            style={{ backgroundColor: theme.colors.primary, height: 50 }}
            renderLabel={({ route, focused, color }) => <Text variant='titleMedium' style={{ color }}>{route.title}</Text>}
          />
        )
      }
    }
  }, [showFab, hideFab])

  return (
      <View style={styles.pageWrapper}>
        <View style={[styles.patientDetails]}>
          <View style={styles.metaWrapper}>
            <View style={styles.nameWrapper}>
              {patient.avatar && collapsed && (
                <Image 
                  source={{ uri: patient.avatar }} 
                  style={styles.avatar}
                />
              )}
              <Text style={styles.patientFullname}>
                {patient.fullName}
              </Text>
            </View>
            <ButtonRowPanel 
              onEdit={() => navigation.navigate('AddPatient', { patient, phones })}
              onDelete={onConfirmDeletePatient}
            />
          </View>
          <View style={[styles.phoneListWrapper, !collapsed && { display: 'none' }]}>
            <PhonesList phones={phones} />
          </View>
          <View style={[styles.patientButtons, !collapsed && { display: 'none' }]}>
            <View style={styles.formulaButtonView}>
              <Button onPress={() => navigation.navigate('TeethFormula', { patient })}>Зубная формула</Button>
            </View>
            <CallButton onPress={onCall} />
            {patient.hasWhatsapp && <WhatsappButton onPress={onSendMessage('whatsapp')} />}
            {patient.hasTelegram && <TelegramButton onPress={onSendMessage('telegram')} />}
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
  nameWrapper: { flexShrink: 3, flexDirection: 'row', marginRight: 4, alignItems: 'center' },
  avatar: { width: 60, height: 50, marginRight: 6, borderRadius: 6 },
  patientFullname: {
    fontWeight:'800',
    fontSize: 18,
    lineHeight: 22,    
    marginBottom: 3,
    flexWrap: 'wrap',
    paddingRight: 56
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
