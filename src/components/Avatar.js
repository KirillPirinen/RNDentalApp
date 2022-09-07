import React from 'react'
import { Avatar as PaperAvatar } from 'react-native-paper'

export const Avatar = ({ fullName }) => {
  const separated = fullName.toUpperCase().split(' ')
  return <PaperAvatar.Text 
    style={{ marginRight: 16 }} 
    size={40} 
    label={separated[0][0] + (separated[1]?.[0] || '')} 
  />
}
