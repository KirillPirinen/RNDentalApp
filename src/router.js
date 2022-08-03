import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar from './components/AppHeader';
import { Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient } from './pages'
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const HeadNav = () => (
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
)

function BottomTabs() {
  return (
      <Tab.Navigator screenOptions={{ headerShown:false }}>
        <Tab.Screen name="Записи" component={Appointments} />
        <Tab.Screen name="Все пациенты" component={PatientsList} />
      </Tab.Navigator>
  );
}

const Router = () => (
    <NavigationContainer>
      <HeadNav/>
    </NavigationContainer>
  )

export default Router

