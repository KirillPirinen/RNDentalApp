import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar from './components/AppHeader';
import { Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient, 
  ImportContacts} from './pages'
import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StatusBar } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TeethFormula from './pages/TeethFormula'
import { useModal } from './context/modal-context';

const Stack = createNativeStackNavigator()
const Tab = createMaterialBottomTabNavigator()

function BottomTabs() {
  const theme = useTheme()
  return (
      <Tab.Navigator 
        screenOptions={{ headerShown:false, activeTintColor:'blue' }}
      >
        <Tab.Screen 
          name="Записи" 
          component={Appointments}
          options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="calendar-check" color={color} size={26} />
              )
          }}
        />
        <Tab.Screen 
          name="Все пациенты" 
          component={PatientsList}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-injury" color={color} size={26} />
            )
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
          header: (props) => <CustomNavigationBar {...props} />
        }}
        screenListeners={{
          focus: (e) => {
            dispatch({ type: actions.CLEAR })
          },
        }}
      >
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Detail" component={PatientDetail} />
        <Stack.Screen name="AddAppointment" component={AddAppointment} />
        <Stack.Screen name="AddPatient" component={AddPatient} />
        <Stack.Screen name="TeethFormula" component={TeethFormula} />
        <Stack.Screen name="ImportContacts" component={ImportContacts} />
      </Stack.Navigator>
    </>
  )
}

export default Router

