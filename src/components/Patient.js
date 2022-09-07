import { View, TouchableHighlight, StyleSheet, Text } from 'react-native'
import styled from 'styled-components/native'
import { Surface, useTheme } from 'react-native-paper'
import { Avatar } from './Avatar'
import { memo } from 'react'

export const Patient = ({ patient, onLongPress, onPress }) => {
  const theme = useTheme()
  return (
      <TouchableHighlight 
        onLongPress={onLongPress} 
        onPress={onPress}
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
    padding: 20
  }
})


const GroupItem = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f3f3;
  background-color: white;
`
