
export const modalContentsAction = {
  CONFIRM_DELETE: 'ConfirmDeleteCommon',
  CHOOSE_ADD_PATIENT_METHOD: 'ChooseAddPatientMethod',
  PROGRESS: 'Progress',
  CHOOSE_TEMPLATE: 'ChooseTemplate',
  CHOOSE_TEETH: 'ChooseTeeth',
  ABOUT_INFO: 'AboutInfo',
  INFO: 'Info',
  CHOOSE_SYNC: 'ChooseSync'
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
