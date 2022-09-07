import React from "react"
import { RadioButton } from "react-native-paper"
import withObservables from '@nozbe/with-observables'
import { StyleSheet } from "react-native"

const Phone = ({ phone, onMarkPrime }) => {
  return (
      <RadioButton.Item 
        status={phone.isPrimary ? 'checked' : 'unchecked'} 
        onPress={() => onMarkPrime(phone)}
        labelStyle={phone.isPrimary ? styles.checkedLabel : styles.uncheckedLabel}
        style={styles.wrapper}
        label={phone.number}
        labelVariant="labelMedium"
        mode="ios"
      />
  )
}

const ObservablePhone = withObservables(['phone'], ({ phone }) => ({
  phone
}))(Phone)

export const PhonesList = ({ phones }) => {
  const onMarkPrime = (marked) => {
    if(!marked.isPrimary) {
      marked.markAsPrime(phones.filter(phone => phone.id !== marked.id))
    }
  }
  return phones?.map(phone => <ObservablePhone
    key={phone.id} 
    phone={phone} 
    onMarkPrime={onMarkPrime} 
  />)
}

const styles = StyleSheet.create({
  checkedLabel: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
  },
  uncheckedLabel: {
    color:'black'
  },
  wrapper: { paddingVertical: 0, paddingHorizontal: 1 }
})
