import React from 'react'
import { Container } from '../components'
import { Card, Title, Paragraph } from 'react-native-paper'

export const TemplatesList = () => {
  return (
    <Container>
      <Card>
        <Card.Content>
          <Title>Card title</Title>
          <Paragraph>Card content</Paragraph>
        </Card.Content>
      </Card>
    </Container>
  )
}
