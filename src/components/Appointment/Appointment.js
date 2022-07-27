import { View, TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'
import { Avatar } from 'react-native-paper';
import GrayText from '../GrayText'
import Badge from '../Badge'

const Appointment = ({ onLongPress }) => {
  return (
    <TouchableHighlight onLongPress={onLongPress}>
      <GroupItem>
        <Avatar.Text style={{ marginRight: 16 }} size={40} label="XD" />
        <View style={{ flex: 1 }}>
          <FullName>Анжела Матиева</FullName>
          <GrayText>пульпит, удаление зуба</GrayText>
        </View>
        <Badge active>{'12:30'}</Badge>
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

export default Appointment;
