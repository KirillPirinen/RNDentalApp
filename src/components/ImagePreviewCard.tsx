import { Image, View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { FC, ReactNode, useState } from 'react';

const icons = {
  pdf: { name: 'file-pdf', color: '#FA0F00' },
  xls: { name: 'file-excel', color: '#008000' },
  xlsx: { name: 'file-excel', color: '#008000' },
  doc: { name: 'file-word', color: '#00a2ed' },
  docx: { name: 'file-word', color: '#00a2ed' }
} as const

export type FileTypes = keyof typeof icons
export type IconNames = typeof icons[FileTypes]['name']

export type IconProps = React.ComponentProps<typeof FontAwesome5> & {
  fileName: string;
  name: IconNames;
  children?: ReactNode;
}

export const Icon: FC<IconProps> = ({ fileName, children, ...props }) => (
  <View style={styles.iconWrapper}>
    {children ?? <FontAwesome5 {...props} />}
    <Text variant="bodyLarge" style={styles.fileName}>{fileName}</Text>
  </View>
)

export type ImagePreviewCardProps = {
  name?: string;
  type?: FileTypes;
  uri?: string;
  size?: number; 
  style?: object;
}

export const ImagePreviewCard: FC<ImagePreviewCardProps> = ({ name, type, uri, size = 24, style }) => {
  const [error, setError] = useState<null | object>(null)
  const stub = type && icons[type] && <Icon fileName={name} {...icons[type]} style={style} size={size} />
  
  if (error) {
    return (
      <Icon fileName={name} name="image-off" style={style} size={size}>
        <MaterialCommunityIcons name="image-off" color="#FA0F00" style={style} size={size} />
      </Icon>
    )
  }

  return stub || uri && <Image source={{ uri }} style={style} onError={setError} />
}

const styles = StyleSheet.create({
  fileName: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 10,
  },
  iconWrapper: {
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
