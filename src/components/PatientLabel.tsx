import React, { FC } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Text } from 'react-native-paper'
import Patient from '../db/models/Patient';

export type PatientLabelProps = {
  patient: Patient;
  showAvatar?: boolean
}

export const PatientLabel: FC<PatientLabelProps> = ({ patient, showAvatar }) => {
  return (
    <View style={styles.nameWrapper}>
    {patient.avatar && showAvatar && (
      <Image 
        source={{ uri: patient.avatar }} 
        style={styles.avatar}
      />
    )}
    <Text style={styles.patientFullname}>
      {patient.fullName}
    </Text>
  </View>
  )
}

const styles = StyleSheet.create({
  nameWrapper: { flexShrink: 3, flexDirection: 'row', marginRight: 4, alignItems: 'center' },
  avatar: { width: 60, height: 50, marginRight: 6, borderRadius: 6 },
  patientFullname: {
    fontWeight:'800',
    fontSize: 18,
    lineHeight: 22,    
    marginBottom: 3,
    flexWrap: 'wrap',
    paddingRight: 56
  },
})
