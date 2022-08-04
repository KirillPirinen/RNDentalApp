import { View, TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'
import { Avatar } from 'react-native-paper';

export const Patient = ({ patient, onLongPress, onPress }) => {
  return (
    <TouchableHighlight onLongPress={onLongPress} onPress={onPress}>
      <GroupItem>
        <Avatar.Text style={{ marginRight: 16 }} size={40} label="XD" />
        <View style={{ flex: 1 }}>
          <FullName>{patient.fullName}</FullName>
        </View>
      </GroupItem>
    </TouchableHighlight>
  )
}

const FullName = styled.Text`
  font-weight: 600;
  font-size: 16px;
`

const GroupItem = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f3f3;
  background-color: white;
`
