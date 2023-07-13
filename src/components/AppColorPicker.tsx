import { FC, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { TriangleColorPicker } from 'react-native-color-picker'
import { HsvColor, IPickerProps } from 'react-native-color-picker/dist/typeHelpers'
import tinycolor2 from 'tinycolor2'

export type AppColorPickerProps = Omit<IPickerProps, 'onColorSelected' | 'onColorChange'> & {
  onSelect: (hex: string) => void
  onCancel?: () => void
}

export const AppColorPicker: FC<AppColorPickerProps> = ({ defaultColor, onSelect, onCancel, ...rest }) => {
  const api = useMemo(() => {
    let colorPreserved = defaultColor
    
    const changeColor = (color: HsvColor) => {
      colorPreserved = color
    }

    const selectColor = (color?: string) => {
      return onSelect(color ? color : `#${tinycolor2(colorPreserved).toHex()}`)
    }

    return {
      colorPreserved,
      changeColor,
      selectColor
    }
  }, [onSelect])

  return (
    <View style={styles.full}>
      {/* @ts-ignore */}
      <TriangleColorPicker
        style={styles.full}
        onColorChange={api.changeColor}
        onColorSelected={api.selectColor}
        defaultColor={api.colorPreserved}
        {...rest}
      />
      <Button 
        style={styles.selectColorBtn} 
        icon="select-color"
        mode="contained" 
        buttonColor={'green'}
        onPress={() => api.selectColor()}
      >
        Выбрать цвет
      </Button>
      {onCancel && <Button 
        style={styles.cancelColorBtn} 
        icon="keyboard-return"
        mode="contained" 
        buttonColor={'grey'}
        onPress={onCancel}
      >
        Отмена
      </Button>}
    </View>
  )
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  cancelColorBtn: { marginHorizontal: 15, marginVertical: 10 },
  selectColorBtn: { marginHorizontal: 15, marginTop: 10 }
})
