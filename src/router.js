import { View, Text, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'styled-components/native';
import { Patients, PatientDetail, AddAppointment } from './pages';

const Stack = createNativeStackNavigator();

const Router = () => {
  const theme = useTheme()
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: theme.primary,
        }}
      >
        <Stack.Screen name="Home" component={Patients} />
        <Stack.Screen name="Detail" component={PatientDetail} />
        <Stack.Screen name="AddAppointment" component={AddAppointment} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Router
