import * as React from 'react'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const AppFooter = () => {
  const navigation = useNavigation()
  return (
      <Appbar>
        <Appbar.Action
          icon="calendar"
          onPress={() => console.log('Pressed archive')}
         />
         <Appbar.Action
           icon="account-injury"
           onPress={() => navigation.navigate('PatientsList')}
         />
       </Appbar>
      )
}

export default AppFooter

