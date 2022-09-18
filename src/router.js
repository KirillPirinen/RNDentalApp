import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar from './components/AppHeader'
import { Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient, ImportContacts, Settings, AddTemplate, TemplatesList, ConfirmAppointment } from './pages'
import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TeethFormula from './pages/TeethFormula'
import { useModal } from './context/modal-context'
import { Text } from 'react-native-paper'

const renderIcon = (name) => ({ color }) => (
  <MaterialCommunityIcons name={name} color={color} size={22} />
)

const renderHeader = (props) => <CustomNavigationBar {...props} />

export const TabsName = {
  records: 'Записи',
  patients: 'Все пациенты',
  settings: 'Настройки'
}

const Icons = {
  records: renderIcon('calendar-check'),
  patients: renderIcon('account-injury'),
  settings: renderIcon('cog-outline')
}

const Stack = createNativeStackNavigator()
const Tab = createMaterialBottomTabNavigator()

function BottomTabs() {
  const theme = useTheme()
  return (
      <Tab.Navigator
        sceneAnimationType="shifting"
        barStyle={{ 
          height: 60,
          backgroundColor: theme.colors.primary,
        }}
        activeColor="white"
        inactiveColor="white"
        tabBarLabelStyle={{ color: 'red' }}
        renderLabel={({ focused, route }) => (
            <Text
              variant="labelSmall"
              style={{ 
                textAlign: 'center',
                color: focused ? theme.colors.onPrimary : theme.colors.onSecondaryContainer,
                marginTop: -7
              }}
            >
            {route.name}
            </Text>
          )
        }
        shifting
      >
        <Tab.Screen 
          name={TabsName.records}
          component={Appointments}
          options={{ tabBarIcon: Icons.records }}
        />
        <Tab.Screen 
          name={TabsName.patients}
          component={PatientsList}
          options={{ tabBarIcon: Icons.patients }} 
        />
        <Tab.Screen 
          name={TabsName.settings} 
          component={Settings}
          options={{ tabBarIcon: Icons.settings }}
        />
      </Tab.Navigator>
  )
}

const Router = () => {
  const [actions, dispatch] = useModal()
  return (
      <Stack.Navigator
        screenOptions={{ header: renderHeader }}
        screenListeners={{
          focus: (e) => dispatch({ type: actions.CLEAR })
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={BottomTabs} 
          //options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Detail" 
          component={PatientDetail}
          options={{ headerTitle: 'Карточка пациента' }} 
        />
        <Stack.Screen options={({ route }) => ({ headerTitle: route.params?.edit ? 'Редактирование записи' : 'Добавление записи' })} name="AddAppointment" component={AddAppointment} />
        <Stack.Screen options={{ headerTitle: 'Добавление пациента' }} name="AddPatient" component={AddPatient} />
        <Stack.Screen options={{ headerTitle: 'Зубная формула' }} name="TeethFormula" component={TeethFormula} />
        <Stack.Screen options={{ headerTitle: 'Импорт контактов' }} name="ImportContacts" component={ImportContacts} />
        <Stack.Screen options={{ headerTitle: 'Добавить новый шаблон' }} name="AddTemplate" component={AddTemplate} />
        <Stack.Screen options={{ headerTitle: 'Управление шаблонами' }} name="TemplatesList" component={TemplatesList} />
        <Stack.Screen options={{ headerTitle: 'Подтверждение приема' }} name="ConfirmAppointment" component={ConfirmAppointment} />
      </Stack.Navigator>
  )
}

export default Router

