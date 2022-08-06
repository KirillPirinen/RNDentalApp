import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar from './components/AppHeader';
import { Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient } from './pages'
import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function BottomTabs() {
  return (
      <Tab.Navigator 
        screenOptions={{ headerShown:false }}
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
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
      />
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />
        }}
      >
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Detail" component={PatientDetail} />
        <Stack.Screen name="AddAppointment" component={AddAppointment} />
        <Stack.Screen name="AddPatient" component={AddPatient} />
      </Stack.Navigator>
    </>
  )
}

export default Router

