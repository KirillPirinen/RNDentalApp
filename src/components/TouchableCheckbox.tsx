import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Checkbox, Text, TouchableRipple } from 'react-native-paper';

type CommonProps = {
  label: string;
  value?: boolean;
  style?: object;
};

type SimpleCB = (data: boolean) => void
type ComplexCB = (data: TouchableCheckboxDTO) => void

export type TouchableCheckboxDTO = {
  name: string;
  value: boolean;
};

export type TouchableCheckboxProps = CommonProps & (
  {
    onPress?: ComplexCB;
    name: string;
  } | {
    onPress?: SimpleCB;
    name?: never;
  }
);

export const TouchableCheckbox = ({
  label,
  value,
  onPress,
  style,
  name,
}: TouchableCheckboxProps) => {
  const [_checked, setChecked] = useState<boolean>(Boolean(value));
  
  const handlePress = () => {
    const newValue = !_checked;
    setChecked(newValue);
    if (onPress) {
      name ? (onPress as ComplexCB)({ name, value: newValue }) : (onPress as SimpleCB)(newValue)
    }
  };

  return (
    <TouchableRipple onPress={handlePress} style={[styles.wrapper, style]}>
      <>
        <Text style={styles.label}>{label}</Text>
        <Checkbox status={_checked ? 'checked' : 'unchecked'} />
      </>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  label: { fontSize: 16 },
});
