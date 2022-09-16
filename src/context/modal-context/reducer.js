import actions from './action-types'

export default (state, action) => {
  switch (action.type) {

    case actions.INFO:
    case actions.IMPORT_PROGRESS:
    case actions.CHOOSE_ADD_PATIENT_METHOD: return {
      as: action.type,
      props: action.payload,
      __visible: true
    }
    
    case actions.CHOOSE_TEMPLATE:
    case actions.CONFIRM_DELETE: return action.payload.mode ? {
      as: action.type,
      props: action.payload,
      __visible: true
    } : console.error('mode is required')

    case actions.HIDE: return {
      ...state,
      __visible: false
    }

    case actions.CLEAR: return null

    default: console.error('unknown action type');
  }
}
