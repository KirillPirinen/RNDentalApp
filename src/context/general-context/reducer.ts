import { RegistredModalContent } from '../../components/PortalContent'
import { AllowedSettings } from '../../consts'
import { AppActionTypes, SelectAction } from '../../types/AppDispatch'
import actions from './action-types'

export type AppState = {
  modal: null | {
    as?: keyof RegistredModalContent
    props?: object,
    __visible: boolean
  },
  settings: AllowedSettings
}

export default <T extends AppActionTypes>(state: AppState, action: SelectAction<T>): AppState => {

  switch (action.type) {

    case actions.UPDATE_SETTINGS: {
      if(action.payload?.length) {
        return {
          ...state,
          settings: {
            ...state.settings, 
            ...action.payload.reduce((acc, setting) => {
               
              // @ts-ignore
              acc[setting.name] = setting.value
              return acc
            }, {} as Partial<AllowedSettings>)
          }
        }
      }
      return state
    }

    case actions.CHOOSE_SYNC:
    case actions.USER_INFO:
    case actions.INFO:
    case actions.CHOOSE_TEETH:
    case actions.PROGRESS:
    case actions.CHOOSE_ADD_PATIENT_METHOD: return {
      ...state,
      modal: {
        as: action.type,
        props: action.payload,
        __visible: true
      }
    }
    
    case actions.CHOOSE_TEMPLATE:
    case actions.CONFIRM_DELETE: {

      if (!action.payload.mode) {
        console.error('mode is required')
        return state
      }

      return  {
        ...state,
        modal: {
          as: action.type,
          props: action.payload,
          __visible: true
        }
      }
    }

    case actions.HIDE: return {
      ...state,
      modal: {
        ...state,
        __visible: false
      }
    }

    case actions.CLEAR: return { ...state, modal: null }

    default: {
      console.error('unknown action type')
      return state
    }
  }
}
