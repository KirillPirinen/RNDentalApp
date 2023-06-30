import { useDatabase } from '@nozbe/watermelondb/hooks'
import React, { FC, ReactNode, createContext, useContext, useEffect, useReducer } from 'react'
import { DEFAULT_SETTINGS } from '../../consts'
import actionTypes from './action-types'
import reducer, { AppState } from './reducer'
import { AppDispatch } from '../../types/AppDispatch'
import Settings from '../../db/models/Settings'

export const initialSlices: AppState = {
  modal: null,
  settings: DEFAULT_SETTINGS
}

const GeneralControlContext = createContext<AppDispatch>(() => undefined)

const ModalContentContext = createContext(initialSlices.modal)
const SettingsContext = createContext(initialSlices.settings)


export const GeneralContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialSlices)

  const db = useDatabase()

  useEffect(() => {
    const sub = db.get<Settings>('settings')
      .query()
        .observeWithColumns(['value'])
          .subscribe((payload) => (dispatch as AppDispatch)({ type: actionTypes.UPDATE_SETTINGS, payload }))
    return sub.unsubscribe
  }, [])
  
  return (
    <SettingsContext.Provider value={state.settings}>
      <ModalContentContext.Provider value={state.modal}>
        <GeneralControlContext.Provider value={dispatch}>
          {children}
        </GeneralControlContext.Provider>
      </ModalContentContext.Provider>
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
export const useGeneralControl = (): [typeof actionTypes, AppDispatch] => [actionTypes, useContext(GeneralControlContext)]
export const useModalContent = () => useContext(ModalContentContext)
