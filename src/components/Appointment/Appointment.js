import { View, TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'

import GrayText from '../GrayText'
import Badge from '../Badge'

const Appointment = ({ onLongPress }) => {
  return (
    <TouchableHighlight onLongPress={onLongPress}>
      <GroupItem>
        <Avatar
          style={{
            backgroundColor: 'lightblue'
          }}
        >
          <Letter style={{ color: 'blue' }}>
            {'А'}
          </Letter>
        </Avatar>
        <View style={{ flex: 1 }}>
          <FullName>Анжела Матиева</FullName>
          <GrayText>пульпит, удаление зуба</GrayText>
        </View>
        <Badge active>{'12:30'}</Badge>
      </GroupItem>
    </TouchableHighlight>
  )
}

const Letter = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-top: -1px;
`

const FullName = styled.Text`
  font-weight: 600;
  font-size: 16px;
`

const Avatar = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  width: 40px;
  height: 40px;
  margin-right: 15px;
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
