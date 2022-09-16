import React, { useRef, useEffect } from 'react'
import { Portal, useTheme } from 'react-native-paper'
import { StatusBar } from 'react-native'
import { useModalContent, useModal } from '../../context/modal-context'
import RegisterContent from '../PortalContent'
import { useNavigation } from '@react-navigation/native'

export const ContextedPortal = () => {
  const state = useModalContent()
  const [actions, dispatch] = useModal()
  const navigation = useNavigation()
  const theme = useTheme()

  const __defaultHandlers = useRef({
    hide: dispatch.bind(null, { type: actions.HIDE }),
    clear: dispatch.bind(null, { type: actions.CLEAR }),
    dispatch,
    navigation,
    theme
  })

  const Content = RegisterContent[state?.as]
  
  // useEffect(() => {
  //   if(Content) {
  //     StatusBar.setBackgroundColor('#000000', true)
  //   }
  //   return () => StatusBar.setBackgroundColor(theme.colors.primary, true)
  // }, [Content])

  return (
    <Portal>
        {Content && <Content 
          {...state.props || {}}
          __visible={state.__visible}
          __defaultHandlers={__defaultHandlers}
        />}
    </Portal>
  )
}
