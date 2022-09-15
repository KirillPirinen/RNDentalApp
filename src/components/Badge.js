import { StyleSheet, Text } from 'react-native'
import { APPOINTMENT_STATUS } from '../utils/constants'

const { lasts, future, past } = APPOINTMENT_STATUS

export default ({ children, status, style }) => (
  <Text
    style={[
    styles.mainStyles,
    styles[status] || styles.default, 
    style
  ]}
  >
    {children}
  </Text>
)

const styles = StyleSheet.create({
  mainStyles: {
    fontSize: 14,
    fontWeight: '800',
    textAlign:'center', 
    textAlignVertical: 'center',
    borderRadius: 18,
    width: 70,
    height: 28
  },
  [past]: {
    backgroundColor: '#2A86FF',
    color: '#fff'
  },
  [lasts]: {
    backgroundColor: 'rgba(42, 134, 255, 0.6)',
    color: '#fff'
  },
  [future]: {
    backgroundColor: '#E9F5FF',
    color: '#4294ff'
  },
  default: {
    backgroundColor: '#E9F5FF',
    color: '#4294ff'
  },
  green: {
    backgroundColor: 'rgba(132, 210, 105, 0.35)',
    color: '#7da453'
  },
})
