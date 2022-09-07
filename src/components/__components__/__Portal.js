import React, { useRef } from 'react'
import { Portal } from 'react-native-paper'
import { useModalContent, useModal } from '../../context/modal-context'
import RegisterContent from '../PortalContent'

export const ContextedPortal = () => {
  const state = useModalContent()
  const [actions, dispatch] = useModal()

  const __defaultHandlers = useRef({
    hide: dispatch.bind(null, { type: actions.HIDE }),
    clear: dispatch.bind(null, { type: actions.CLEAR })
  })

  const Content = RegisterContent[state?.as]

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
