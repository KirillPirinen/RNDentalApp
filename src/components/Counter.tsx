import { useMemo, useState } from "react"
import { View, StyleSheet } from "react-native"
import { IconButton, Text } from "react-native-paper"

export type CounterData<N extends string> = { 
  name: N;
  value: number; 
}

export type CounterProps<N extends string> = {
  initial?: number;
  name: N;
  onChange: (dto: CounterData<N>) => void;
}

//@ts-ignore
export const Counter = <N extends string = 'counter'>({ onChange, initial = 0, name = 'counter' }: CounterProps<N>) => {
  const [num, setNum] = useState<number>(initial)

  const cb = useMemo(() => {
    let timer: NodeJS.Timeout

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
