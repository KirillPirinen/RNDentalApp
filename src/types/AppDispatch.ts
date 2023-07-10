import { RegistredModalContent } from '../components/PortalContent'
import { ContextedPortalOmitDefaultProps } from '../widgets/Portal';
import { AllowedSettings } from '../consts';
import { modalControlAction, settingsAction, modalContentsAction } from '../context/general-context/action-types';
import Settings from '../db/models/Settings';

export type ContentModalActionTypes = typeof modalContentsAction[keyof typeof modalContentsAction]
export type ControlModalActionTypes = keyof typeof modalControlAction
export type SettingsActionTypes = keyof typeof settingsAction
export type AppActionTypes = ContentModalActionTypes | ControlModalActionTypes | SettingsActionTypes

export type GeneralContentModalAction<T extends ContentModalActionTypes, P = ContextedPortalOmitDefaultProps<React.ComponentProps<RegistredModalContent[T]>>> = {
  type: T;
} & (P extends Record<string, never> ? { payload?: never } : { payload: P })

export type GeneralControlModalAction<T extends ControlModalActionTypes> = {
  type: T
}

export type GeneralSettingsAction<T extends SettingsActionTypes> = {
  type: T,
  payload: Array<Record<keyof AllowedSettings, AllowedSettings[keyof AllowedSettings]> | Settings>
}

export type SelectAction<T extends AppActionTypes> = 
  T extends ContentModalActionTypes ? GeneralContentModalAction<T> : 
  T extends ControlModalActionTypes ? GeneralControlModalAction<T> : 
  T extends SettingsActionTypes ? GeneralSettingsAction<T> : 
  never

export type AppDispatch = <T extends AppActionTypes>(action: SelectAction<T>) => void
