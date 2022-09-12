import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

export const getHeaderTitle = (route) => {
  return getFocusedRouteNameFromRoute(route) || 'Записи'
}
