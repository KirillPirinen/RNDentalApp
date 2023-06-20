import { View, TouchableHighlight, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { Surface } from 'react-native-paper'
import { Avatar } from './Avatar'
import { memo } from 'react'

export const Patient = ({ 
  patient, 
  onLongPress, 
  onPress, 
  navigation, 
  theme, 
  style, 
  children,
  renderName
}) => {
  const __onPress = onPress || function () { navigation?.navigate('Detail', { patient }) }

  return (
      <TouchableHighlight 
        onLongPress={onLongPress} 
        onPress={__onPress}
        underlayColor={theme.colors.primary}
      >
        <Surface 
          style={[styles.groupItem, style]} 
          elevation={2}
        >
          <Avatar 
            style={{ marginRight: 16 }} 
            size={40} 
            fullName={patient.fullName}
            src={patient.avatar}
          />
          <View style={{ flex: 1 }}>
            {renderName?.(patient.fullName) ?? <Text style={styles.fullName}>{patient.fullName}</Text>}
            {children}
          </View>
        </Surface>
      </TouchableHighlight>
  )
}

export default memo(Patient)

const styles = StyleSheet.create({
  fullName: {
    fontSize: 16,
    fontWeight: "600"
  },
  groupItem: {
    alignItems: 'center',
    flexDirection:'row',
    padding: 20,
  }
})
