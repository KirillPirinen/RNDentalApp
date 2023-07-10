import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { ButtonRowPanel } from './Buttons'
import Group from '../db/models/Group'

export type GroupCardProps = {
  group: Group;
  onDelete?: (temp: Group) => void;
  onEdit?: (temp: Group) => void;
  onAddPatient?: (temp: Group) => void;
}

const GroupCard: FC<GroupCardProps> = ({ group, onDelete, onEdit, onAddPatient }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerWrapper}>
          <View style={styles.content}>
            <Text variant="titleLarge" style={{ flexWrap: 'wrap' }}>{group.name}</Text>
            {group.description && <Text variant="titleSmall">Описание:</Text>}
            <Text variant="bodyMedium" selectable>{group.description || 'Описание отсутствует'}</Text>
          </View>
          <View style={styles.panel}>
          <ButtonRowPanel
            key="first"
            onDelete={onDelete && (() => onDelete(group))} 
            onEdit={onEdit && (() => onEdit(group))}
            buttonsStyle={styles.buttons}
          >
          </ButtonRowPanel>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

export default GroupCard;

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection:'row',
    justifyContent:'space-between',
  },
  content: {
    flexShrink: 1
  },
  card: { margin: 5 },
  panel: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: -18,
    marginLeft: 5
  },
  buttons: {
    margin: 0
  },
  rowPanel: { flexWrap: 'wrap', width: 110, justifyContent: 'center' }
})
