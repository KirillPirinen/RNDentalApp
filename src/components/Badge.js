import { Text } from 'react-native'
import styled from 'styled-components/native'
import { APPOINTMENT_STATUS } from '../utils/constants'

const { lasts, future, past } = APPOINTMENT_STATUS

const statusColor = {
  [past]: {
    background: '#2A86FF',
    color: '#fff'
  },
  [lasts]: {
    background: 'rgba(42, 134, 255, 0.6)',
    color: '#fff'
  },
  [future]: {
    background: '#E9F5FF',
    color: '#4294ff'
  },
  default: {
    background: '#E9F5FF',
    color: '#4294ff'
  },

  //custom colors
  green: {
    background: 'rgba(132, 210, 105, 0.35)',
    color: '#7da453'
  }
}

export default styled(Text)(({ status }) => {
  const colors = statusColor[status] || statusColor.default

  return `
    background-color: ${colors.background};
    color: ${colors.color};
    border-radius: 18px;
    font-weight: 600;
    font-size: 14px;
    width: 70px;
    height: 28px;
    text-align: center;
    line-height: 30px;
  `
})
