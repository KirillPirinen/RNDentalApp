import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar from './components/AppHeader';
import { Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient } from './pages'
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
      <Tab.Navigator screenOptions={{ headerShown:false }}>
        <Tab.Screen name="Записи" component={Appointments} />
        <Tab.Screen name="Все пациенты" component={PatientsList} />
      </Tab.Navigator>
  );
}

const Router = () => {
  const theme = useTheme()
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  )
}

export default Router

