import { useDatabase } from '@nozbe/watermelondb/hooks'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { DEFAULT_SETTINGS } from '../../consts'
import actionTypes from './action-types'
import reducer from './reducer'

const ModalContentContext = createContext()
const GeneralControlContext = createContext()
const SettingsContext = createContext()

const initialSlices = {
  modal: null,
  settings: DEFAULT_SETTINGS
}

export const GeneralContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialSlices)

  const db = useDatabase()

  useEffect(() => {
    const sub = db.get('settings')
      .query()
        .observeWithColumns(['value'])
          .subscribe((payload) => dispatch({ type: actionTypes.UPDATE_SETTINGS, payload }))
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
export const useGeneralControl = () => [actionTypes, useContext(GeneralControlContext)]
export const useModalContent = () => useContext(ModalContentContext)
