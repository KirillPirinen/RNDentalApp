import { Image, View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { FontAwesome5 } from '@expo/vector-icons';

const icons = {
  pdf: { name: 'file-pdf', color: '#FA0F00' },
  xls: { name: 'file-excel', color: '#008000' },
  xlsx: { name: 'file-excel', color: '#008000' },
  doc: { name: 'file-word', color: '#00a2ed' },
  docx: { name: 'file-word', color: '#00a2ed' }
}

export const Icon = ({ fileName, ...props}) => (
  <View style={styles.iconWrapper}>
    <FontAwesome5 {...props} />
    <Text variant="bodyLarge" style={styles.fileName}>{fileName}</Text>
  </View>
)

export const ImagePreviewCard = ({ name, type, uri, size = 24, style }) => {
  const stub = icons[type] && <Icon fileName={name} {...icons[type]} style={style} size={size} />
  return stub || <Image source={{ uri }} style={style} />
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
