
export const modalContentsAction = {
  CONFIRM_DELETE: 'ConfirmDeleteCommon',
  CHOOSE_ADD_PATIENT_METHOD: 'ChooseAddPatientMethod',
  PROGRESS: 'Progress',
  CHOOSE_TEMPLATE: 'ChooseTemplate',
  CHOOSE_TEETH: 'ChooseTeeth',
  USER_INFO: 'UserInfo',
  INFO: 'Info',
  CHOOSE_SYNC: 'ChooseSync',
  CONFIRM_COMMON: 'ConfirmCommon',
  PATIENT_APPOINTMENT_DETAILS: 'PatientAppointmentDetails'
} as const

export const modalControlAction = {
  HIDE: 'HIDE',
  CLEAR: 'CLEAR'
} as const

export const settingsAction = {
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_SETTING: 'SET_SETTINGS'
} as const

export default {
  ...settingsAction,
  ...modalControlAction,
  ...modalContentsAction
}
