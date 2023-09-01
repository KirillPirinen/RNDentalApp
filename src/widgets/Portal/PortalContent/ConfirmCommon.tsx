import React from 'react'
import { Confirm, ConfirmProps } from '../../../components/Confirm'
import { ContextedPortalDefaultProps } from '..'
import { Button, ButtonProps } from 'react-native-paper'


export type ConfirmCommonProps = Omit<ConfirmProps, 'visible' | 'onClose' | 'children'> & ContextedPortalDefaultProps<{
  buttons: Array<ButtonProps>
}>

export const ConfirmCommon: React.FC<ConfirmCommonProps> = ({ 
  __visible, 
  __defaultProps,
  buttons,
  ...rest 
}) => {
   
  return (
    <Confirm
      visible={__visible}
      onClose={__defaultProps.clear}
      {...rest}
    >
      {buttons.map((button, index) => <Button key={button.key ?? index} {...button}/>)}
    </Confirm>
  )
}

