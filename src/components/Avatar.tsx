import { FC } from 'react'
import { Avatar as PaperAvatar } from 'react-native-paper'

const defLabStyle = { includeFontPadding: false, lineHeight: undefined }
const defStyle = { marginRight: 16 }

type AvatarProps = {
  fullName: string;
  src?: string | null;
  style?: object;
  size?: number;
}

export const Avatar: FC<AvatarProps> = ({ fullName, src, style, size = 40 }) => {
  const separated = fullName.toUpperCase().split(' ')
  const Comp = src ? PaperAvatar.Image : PaperAvatar.Text

  return <Comp
    color="white"
    style={style ? [defStyle, style] : defStyle}
    size={size} 
    labelStyle={defLabStyle}
    label={separated[0][0] + (separated[1]?.[0] || '')}
    // @ts-ignore
    source={src && { uri: src }}
  />
}
