import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { TAG_REGEX } from '../utils/constants'
import { parseTemplate } from '../utils/parseTemplate'
import { ButtonRowPanel } from './Buttons'

export default function TemplateCard({ template, onDelete, onEdit, hasTags }) {
  const [example, setExample] = useState()

  const onToggleExample = () => setExample(prev => !prev ? parseTemplate(template.text) : null)

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerWrapper}>
          <Text variant="titleLarge">{template.name}</Text>
          <ButtonRowPanel 
            onDelete={onDelete?.(template)} 
            onEdit={onEdit?.(template)}
          >
            {template.hasTags && <IconButton 
              icon={example ? "application-variable" : "application-variable-outline"}
              iconColor={example ? "green" : "black"}
              onPress={onToggleExample}
            />}
          </ButtonRowPanel>
        </View>
        <Text variant="titleSmall">Пример:</Text>
        <Text variant="bodyMedium" selectable>{example || template.text}</Text>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  headerWrapper: { 
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  card: { margin: 5 }
})
