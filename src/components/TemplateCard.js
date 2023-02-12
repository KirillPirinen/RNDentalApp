import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { parseTemplate } from '../utils/parseTemplate'
import { ButtonRowPanel } from './Buttons'

export default function TemplateCard({ template, onDelete, onEdit, hasTags }) {
  const [example, setExample] = useState()

  const onToggleExample = () => setExample(prev => !prev ? parseTemplate(template.text) : null)

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerWrapper}>
          <View style={styles.content}>
            <Text variant="titleLarge" style={{ flexWrap: 'wrap' }}>{template.name}</Text>
            <Text variant="titleSmall">Пример:</Text>
            <Text variant="bodyMedium" selectable>{example || template.text}</Text>
          </View>
          <ButtonRowPanel 
            onDelete={onDelete?.(template)} 
            onEdit={onEdit?.(template)}
            style={styles.panel}
            buttonsStyle={styles.buttons}
          >
            {template.hasTags && <IconButton 
              icon={example ? "application-variable" : "application-variable-outline"}
              iconColor={example ? "green" : "black"}
              onPress={onToggleExample}
            />}
          </ButtonRowPanel>
        </View>
      </Card.Content>
    </Card>
  )
}

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
    flexBasis: 35,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 6
  },
  buttons: {
    margin: 0
  }
})
