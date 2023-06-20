import actions from './action-types'

export default (state, action) => {
  switch (action.type) {

    case actions.UPDATE_SETTINGS: {
      if(action.payload?.length) {
        return {
          ...state,
          settings: {
            ...state.settings, 
            ...action.payload.reduce((acc, setting) => {
              acc[setting.name] = setting.value
              return acc
            }, {})
          }
        }
      }
      return state
    }

    case actions.CHOOSE_SYNC:
    case actions.ABOUT_INFO:
    case actions.INFO:
    case actions.CHOOSE_TEETH:
    case actions.IMPORT_PROGRESS:
    case actions.CHOOSE_ADD_PATIENT_METHOD: return {
      ...state,
      modal: {
        as: action.type,
        props: action.payload,
        __visible: true
      }
    }
    
    case actions.CHOOSE_TEMPLATE:
    case actions.CONFIRM_DELETE: return action.payload.mode ? {
      ...state,
      modal: {
        as: action.type,
        props: action.payload,
        __visible: true
      }
    } : console.error('mode is required')

    case actions.HIDE: return {
      ...state,
      modal: {
        ...state,
        __visible: false
      }
    }

    case actions.CLEAR: return { ...state, modal: null }

    default: console.error('unknown action type');
  }
}
