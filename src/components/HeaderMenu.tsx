import * as React from 'react'
import { Menu, Appbar } from 'react-native-paper'
import { TouchableCheckbox } from './TouchableCheckbox'
import { AppTheme } from '../styles/themes'

const style = { marginRight: 10 }

export const contentTypes = {
  TouchableCheckbox
}

export type HeaderMenuContentTypes = keyof typeof contentTypes

type ComponentsProps = Omit<React.ComponentProps<typeof contentTypes[HeaderMenuContentTypes]>, 'type'>

export type HeaderMenuProps = {
  menu: Array<ComponentsProps & { type: HeaderMenuContentTypes }>
  theme: AppTheme
  contentColor: string;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ menu, theme, contentColor }) => {
  const [visible, setVisible] = React.useState(false)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Menu
      onDismiss={closeMenu}
      visible={visible}
      style={style}
      anchor={<Appbar.Action color={contentColor} icon="dots-vertical" onPress={openMenu} />}
      contentStyle={{ backgroundColor: theme.colors.background }}
    >
      <>
        {menu.map(({ type, label, ...rest }) => {
        const Comp = contentTypes[type]
         
          // @ts-ignore
          return Comp && <Comp key={label} label={label} {...rest} />
        })}
      </>
    </Menu>
  )
}
