import * as React from 'react'
import styled from 'styled-components/native'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const AppFooter = () => {
  const navigation = useNavigation()
  return (
    (
      <AppbarStyled>
        <Appbar.Action
          icon="calendar"
          onPress={() => console.log('Pressed archive')}
         />
         <Appbar.Action
           icon="account-injury"
           onPress={() => navigation.navigate('PatientsList')}
         />
       </AppbarStyled>
      )
  )
}

export default AppFooter

const AppbarStyled = styled(Appbar)`
  justify-content: space-around;
`

