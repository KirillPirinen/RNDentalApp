import { StyleSheet, Text } from 'react-native'
import { APPOINTMENT_STATUS } from '../consts'

const { lasts, future, past } = APPOINTMENT_STATUS

type BadgeProps = {
  status?: string;
  children: React.ReactNode;
  style?: object;
}

const Badge: React.FC<BadgeProps> = ({ children, status, style }) => (
  <Text
    style={[
      styles.mainStyles,
      (status && styles[status]) || styles.default,
      style
    ]}
  >
    {children}
  </Text>
)

export default Badge

const styles = StyleSheet.create({
  mainStyles: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 18,
    width: 70,
    height: 28
  },
  [past]: {
    backgroundColor: '#27A2DF',
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
  }
})
