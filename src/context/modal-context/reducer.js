import actions from './action-types'

export default (state, action) => {
  switch (action.type) {

    case actions.INFO:
    case actions.IMPORT_PROGRESS:
    case actions.CHOOSE_ADD_PATIENT_METHOD:
    case actions.CONFIRM_DELETE_PATIENT: 
    case actions.CONFIRM_DELETE_APPOINTMENT: return {
      as: action.type,
      props: action.payload,
      __visible: true
    }

    case actions.HIDE: return {
      ...state,
      __visible: false
    }

    case actions.CLEAR: return null

    default: console.error('unknown action type');
  }
}
