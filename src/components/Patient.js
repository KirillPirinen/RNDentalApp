import { View, TouchableHighlight, StyleSheet, Text } from 'react-native'
import styled from 'styled-components/native'
import { Avatar, Surface, useTheme } from 'react-native-paper'

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
          <Avatar.Text 
            style={{ marginRight: 16 }} 
            size={40} 
            label={patient.fname[0] + (patient.lname[0] || '')} 
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.fullName}>{patient.fullName}</Text>
          </View>
        </Surface>
      </TouchableHighlight>
  )
}

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
