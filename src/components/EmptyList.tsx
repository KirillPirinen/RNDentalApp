import { t } from '@lingui/core/macro'
import { FC, ReactNode } from 'react'
import { Text, Surface, Avatar } from 'react-native-paper'

export type EmptyListProps = {
  text: string,
  children?: ReactNode
  style?: object
  noIcon?: boolean;
  iconName?: string;
  iconStyle?: object;
}

const iconStyleDefault = { backgroundColor: 'red', marginBottom: 10 }

export const EmptyList: FC<EmptyListProps> = ({ children, style, noIcon, iconStyle = iconStyleDefault, iconName = "exclamation-thick", text = t`Ничего не найдено` }) => (
  <Surface elevation={5} style={{ padding: 12, alignItems:'center', justifyContent:'center', ...style }}>
    {!noIcon && <Avatar.Icon size={30} style={iconStyle} icon={iconName} />}
    <Text variant="labelLarge">{text}</Text>
    {children}
  </Surface>
)
