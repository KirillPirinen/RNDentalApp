import React, { FC } from 'react'
import { RadioButton } from 'react-native-paper'
import withObservables from '@nozbe/with-observables'
import { StyleSheet } from 'react-native'
import { default as PhoneModel } from '../db/models/Phone'

const Phone: FC<{ phone: PhoneModel, onMarkPrime: (phone: PhoneModel) => void }> = ({ phone, onMarkPrime }) => {
  return (
      <RadioButton.Item
        status={phone.isPrimary ? 'checked' : 'unchecked'}
        onPress={() => onMarkPrime(phone)}
        labelStyle={phone.isPrimary ? styles.checkedLabel : undefined}
        style={styles.wrapper}
        label={phone.number}
        value={phone.isPrimary}
        labelVariant="labelLarge"
      />
  )
}

const ObservablePhone = withObservables(['phone'], ({ phone }) => ({
  phone
}))(Phone)

export type PhonesListProps = {
  phones: Array<PhoneModel>
}

export const PhonesList: FC<PhonesListProps> = ({ phones }) => {
  const onMarkPrime = (marked: PhoneModel) => {
    if (!marked.isPrimary) {
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
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000'
  },
  wrapper: { paddingVertical: 0, paddingHorizontal: 1 }
})
