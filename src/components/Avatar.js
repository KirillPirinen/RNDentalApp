import React from 'react'
import { Image } from 'react-native'
import { Avatar as PaperAvatar } from 'react-native-paper'

const defLabStyle = { includeFontPadding: false, lineHeight: undefined }
const defStyle = { marginRight: 16 }

export const Avatar = ({ fullName, src }) => {
  const separated = fullName.toUpperCase().split(' ')
  const Comp = src ? PaperAvatar.Image : PaperAvatar.Text

  return <Comp
    color="white"
    style={defStyle}
    size={40} 
    labelStyle={defLabStyle}
    label={separated[0][0] + (separated[1]?.[0] || '')}
    source={src && { uri: src }}
  />
}
