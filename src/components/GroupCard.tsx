import React, { FC, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { ButtonRowPanel } from './Buttons'
import Group from '../db/models/Group'
import { getAlphaFromColor } from '../utils/getAlphaFromColor'
import { Trans } from '@lingui/react/macro'

export type GroupCardProps = {
  group: Group;
  onDelete?: (temp: Group) => void;
  onEdit?: (temp: Group) => void;
}

const GroupCard: FC<GroupCardProps> = ({ group, onDelete, onEdit }) => {
  const cardContentStyle = useMemo(() => {
    if (group.color) {
      return { 
        backgroundColor: getAlphaFromColor(group.color), 
        borderColor: group.color, 
        borderLeftWidth: 5,
        color: 'white'
      }
    }
  }, [group.color])

  return (
    <Card 
      style={styles.card}
      contentStyle={cardContentStyle}
    >
      <Card.Content>
        <View style={styles.headerWrapper}>
          <View style={styles.content}>
            <Text variant="titleLarge" style={{ flexWrap: 'wrap' }}>{group.name}</Text>
            {group.description && <Text variant="titleSmall"><Trans>Описание</Trans>:</Text>}
            <Text variant="bodyMedium" selectable>{group.description || <Trans>Описание отсутствует</Trans>}</Text>
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
  card: { margin: 5, position: 'relative' },
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
