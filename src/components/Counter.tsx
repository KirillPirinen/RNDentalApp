import { FC, useMemo, useState } from "react"
import { View, StyleSheet } from "react-native"
import { IconButton, Text } from "react-native-paper"

export type CounterData = { 
  name: string;
  value: number; 
}

export type CounterProps = {
  initial?: number;
  name?: string;
  onChange: (dto: CounterData) => void;
}

export const Counter: FC<CounterProps> = ({ onChange, initial = 0, name = 'counter' }) => {
  const [num, setNum] = useState<number>(initial)

  const cb = useMemo(() => {
    let timer: NodeJS.Timer

    const onPressOut = () => clearInterval(timer)

    const dec = (prev: number) => {
      const value = prev - 1
      onChange?.({ name, value })
      return value
    }
    const inc = (prev: number) => {
      const value = prev + 1
      onChange?.({ name, value })
      return value
    }

    return {
      onPressOut,
      onPressInDecrement: () => {
        timer = setInterval(() => {
          setNum(dec)
        }, 100)
      },
      onPressInIncrement: () => {
        timer = setInterval(() => {
          setNum(inc)
        }, 100)
      },
      onDecrement: () => {
        onPressOut()
        setNum(dec)
      },

      onIncrement: () => {
        onPressOut()
        setNum(inc)
      }
    }
  }, [onChange, name])

  return (
    <View style={styles.wrapper}>
      <IconButton
        icon="minus"
        size={30}
        onPress={cb.onDecrement}
        onLongPress={cb.onPressInDecrement}
        onPressOut={cb.onPressOut}
      />
      <Text variant="bodyLarge">{num}</Text>
      <IconButton
        icon="plus"
        size={30}
        onPress={cb.onIncrement}
        onLongPress={cb.onPressInIncrement}
        onPressOut={cb.onPressOut}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
