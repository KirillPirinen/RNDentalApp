import React, { createContext, useContext, useReducer } from 'react'
import actionTypes from './action-types'
import reducer from './reducer'

const ModalContentContext = createContext()
const ModalControlContext = createContext()

export const ModalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, null)
  return (
    <ModalContentContext.Provider value={state}>
      <ModalControlContext.Provider value={dispatch}>
        {children}
      </ModalControlContext.Provider>
    </ModalContentContext.Provider>
  )
}

export const useModal = () => [actionTypes, useContext(ModalControlContext)]
export const useModalContent = () => useContext(ModalContentContext)
