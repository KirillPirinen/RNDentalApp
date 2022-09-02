import * as React from 'react';
import { Menu, Appbar } from 'react-native-paper';
import { TouchableCheckbox } from './TouchableCheckbox';

const style = { marginRight: 10 }

const contentTypes = {
  TouchableCheckbox
}

export const HeaderMenu = ({ menu, theme }) => {
  const [visible, setVisible] = React.useState(true);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      onDismiss={closeMenu}
      visible={visible}
      style={style}
      anchor={<Appbar.Action color={theme.colors.primary} icon="dots-vertical" onPress={openMenu} />}
    >
      {menu.map(({ type, title, ...rest }) => {
        const Comp = contentTypes[type]
        return <Comp key={title} label={title} {...rest} />
      })}
    </Menu>
  )
}
