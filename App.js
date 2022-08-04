import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { database } from './src/db'

const App = () => {
  return (
    <ThemeAdapter>
      <DatabaseProvider database={database}>
          <Router />
      </DatabaseProvider>
    </ThemeAdapter>
  )
}

export default App

/* <NavigationContainer>
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
    </NavigationContainer> */
