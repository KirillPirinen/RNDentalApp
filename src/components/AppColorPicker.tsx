import { FC, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, ColorFormatsObject, ColorPickerRef } from 'reanimated-color-picker';
import { Trans } from '@lingui/react/macro'

export type AppColorPickerProps = {
  onSelect: (hex: string) => void
  onCancel?: () => void
  defaultColor?: string;
}

export const AppColorPicker: FC<AppColorPickerProps> = ({ defaultColor, onSelect, onCancel, ...rest }) => {

  const api = useMemo(() => {
    let colorPreserved = defaultColor
    
    const changeColor = (color: ColorFormatsObject) => {
      colorPreserved = color.hex
    }

    const selectColor = () => {
      colorPreserved && onSelect(colorPreserved)
    }

    return {
      colorPreserved,
      changeColor,
      selectColor
    }
  }, [onSelect])

  return (
    <View style={styles.full}>
      <ColorPicker value={defaultColor || '#ffffff'} onChangeJS={api.changeColor}>
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
          <Swatches />
        </ColorPicker>
      <Button 
        style={styles.selectColorBtn} 
        icon="select-color"
        mode="contained" 
        buttonColor={'green'}
        onPress={api.selectColor}
      >
        <Trans>Выбрать цвет</Trans>
      </Button>
      {onCancel && <Button 
        style={styles.cancelColorBtn} 
        icon="keyboard-return"
        mode="contained" 
        buttonColor={'grey'}
        onPress={onCancel}
      >
        <Trans>Отмена</Trans>
      </Button>}
    </View>
  )
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  cancelColorBtn: { marginHorizontal: 15, marginVertical: 10 },
  selectColorBtn: { marginHorizontal: 15, marginTop: 10 }
})
