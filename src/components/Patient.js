import { View, TouchableHighlight, StyleSheet, Text } from 'react-native'
import { Surface, useTheme } from 'react-native-paper'
import { Avatar } from './Avatar'
import { memo } from 'react'

export const Patient = ({ patient, onLongPress, onPress, navigation }) => {
  const theme = useTheme()
  const __onPress = onPress || function () { navigation?.navigate('Detail', { patient }) }

  return (
      <TouchableHighlight 
        onLongPress={onLongPress} 
        onPress={__onPress}
        underlayColor={theme.colors.primary}
      >
        <Surface 
          style={styles.groupItem} 
          elevation={3}
        >
          <Avatar 
            style={{ marginRight: 16 }} 
            size={40} 
            fullName={patient.fullName}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.fullName}>{patient.fullName}</Text>
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
