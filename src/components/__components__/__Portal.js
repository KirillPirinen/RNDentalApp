import React, { useRef } from 'react'
import { Portal, useTheme } from 'react-native-paper'
import { useModalContent, useGeneralControl } from '../../context/general-context'
import RegisterContent from '../PortalContent'
import { useNavigation } from '@react-navigation/native'

export const ContextedPortal = () => {
  const state = useModalContent()
  const [actions, dispatch] = useGeneralControl()
  const navigation = useNavigation()
  const theme = useTheme()

  const __defaultProps = useRef({
    hide: dispatch.bind(null, { type: actions.HIDE }),
    clear: dispatch.bind(null, { type: actions.CLEAR }),
    dispatch,
    navigation,
    theme
  })

  const Content = RegisterContent[state?.as]

  return (
    <Portal>
        {Content && <Content 
          {...state.props || {}}
          __visible={state.__visible}
          __defaultProps={__defaultProps.current}
        />}
    </Portal>
  )
}
