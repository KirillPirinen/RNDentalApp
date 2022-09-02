import actions from './action-types'

export default (state, action) => {
  switch (action.type) {

    case actions.CONFIRM_DELETE_PATIENT: return {
      as: 'ConfirmDeletePatient',
      props: action.payload,
      __visible: true
    }

    case actions.CONFIRM_DELETE_APPOINTMENT: return {
      as: 'ConfirmDeleteAppointment',
      props: action.payload,
      __visible: true
    }

    case actions.HIDE: return {
      ...state,
      __visible: false
    }

    case actions.CLEAR: return null

    default: console.error('Неизвестный тип экшена');
  }
}
