import * as React from 'react'
import styled from 'styled-components/native'
import { Appbar } from 'react-native-paper'

const AppFooter = () => (
 <AppbarStyled>
   <Appbar.Action
     icon="calendar"
     onPress={() => console.log('Pressed archive')}
    />
    <Appbar.Action
      icon="account-injury"
      onPress={() => console.log('Pressed delete')}
    />
  </AppbarStyled>
 )

export default AppFooter

const AppbarStyled = styled(Appbar)`
  justify-content: space-around;
`

