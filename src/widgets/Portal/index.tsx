import { useRef } from 'react'
import { Portal } from 'react-native-paper'
import { useModalContent, useGeneralControl } from '../../context/general-context'
import RegisterContent from './PortalContent'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { AppTheme, useAppTheme } from '../../styles/themes'
import { AppDispatch } from '../../types/AppDispatch'

type DefaultProps = {
  __defaultProps: {
    hide: () => void,
    clear: () => void,
    dispatch: AppDispatch
    navigation: NavigationProp<ReactNavigation.RootParamList>
    theme: AppTheme
  }
  __visible: boolean
}

export type ContextedPortalDefaultProps<T extends object = Record<string, never>> = T & DefaultProps

export type ContextedPortalOmitDefaultProps<T extends object> = Omit<T, keyof DefaultProps>

export const ContextedPortal = () => {
  const state = useModalContent()
  const [actions, dispatch] = useGeneralControl()
  const navigation = useNavigation()
  const theme = useAppTheme()

  const __defaultProps = useRef({
    hide: dispatch.bind(null, { type: actions.HIDE }),
    clear: dispatch.bind(null, { type: actions.CLEAR }),
    dispatch,
    navigation,
    theme
  })

  const Content = state?.as && RegisterContent[state.as]

  return (
    <Portal>
        {Content && <Content 
          {...state.props}
           
          // @ts-ignore
          __visible={state.__visible}
           
          // @ts-ignore
          __defaultProps={__defaultProps.current}
        />}
    </Portal>
  )
}
