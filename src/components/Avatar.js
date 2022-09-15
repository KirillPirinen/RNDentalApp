import React from 'react'
import { Avatar as PaperAvatar } from 'react-native-paper'

const defLabStyle = { includeFontPadding: false, lineHeight: undefined }
const defStyle = { marginRight: 16 }

export const Avatar = ({ fullName }) => {
  const separated = fullName.toUpperCase().split(' ')
  return <PaperAvatar.Text 
    style={defStyle}
    size={40} 
    labelStyle={defLabStyle}
    label={separated[0][0] + (separated[1]?.[0] || '')} 
  />
}
