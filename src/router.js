import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-paper'
import AppFooter from './components/AppFooter';
import CustomNavigationBar from './components/AppHeader';
import { Appointments, PatientDetail, AddAppointment } from './pages'

const Stack = createNativeStackNavigator();

const Router = () => (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />
        }}
      >
        <Stack.Screen name="Home" component={Appointments} />
        <Stack.Screen name="Detail" component={PatientDetail} />
        <Stack.Screen name="AddAppointment" component={AddAppointment} />
      </Stack.Navigator>
      <AppFooter />
    </NavigationContainer>
  )

export default Router
