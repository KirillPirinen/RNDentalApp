import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar from './components/AppHeader';
import { Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient, ImportContacts, Settings, AddTemplate } from './pages'
import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TeethFormula from './pages/TeethFormula'
import { useModal } from './context/modal-context';

export const TabsName = {
  records: 'Записи',
  patients: 'Все пациенты',
  settings: 'Настройки'
}

const Stack = createNativeStackNavigator()
const Tab = createMaterialBottomTabNavigator()

function BottomTabs() {
  const theme = useTheme()
  return (
      <Tab.Navigator 
        sceneAnimationType="shifting"
        barStyle={{ height: 70 }}
        activeColor={theme.colors.primary}
      >
        <Tab.Screen 
          name={TabsName.records}
          component={Appointments}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-check" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen 
          name={TabsName.patients}
          component={PatientsList}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-injury" color={color} size={26} />
            ),
          }} 
        />
        <Tab.Screen 
          name={TabsName.settings} 
          component={Settings}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={26} />
            ),
          }} 
        />
      </Tab.Navigator>
  );
}

const Router = () => {
  const theme = useTheme()
  const [actions, dispatch] = useModal()
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
      />
      <Stack.Navigator
        screenOptions={{
          header: CustomNavigationBar,
        }}
        screenListeners={{
          focus: (e) => {
            dispatch({ type: actions.CLEAR })
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={BottomTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Detail" 
          component={PatientDetail}
          options={{ headerTitle: 'Карточка пациента' }} 
        />
        <Stack.Screen options={{ headerTitle: 'Добавление записи' }} name="AddAppointment" component={AddAppointment} />
        <Stack.Screen options={{ headerTitle: 'Добавление пациента' }} name="AddPatient" component={AddPatient} />
        <Stack.Screen options={{ headerTitle: 'Зубная формула' }} name="TeethFormula" component={TeethFormula} />
        <Stack.Screen options={{ headerTitle: 'Импорт контактов' }} name="ImportContacts" component={ImportContacts} />
        <Stack.Screen options={{ headerTitle: 'Добавить новый шаблон' }} name="AddTemplate" component={AddTemplate} />
      </Stack.Navigator>
    </>
  )
}

export default Router

