import { Linking } from 'react-native'

export const openDeepLink = async (deepLink) => {
  const can = await Linking.canOpenURL(deepLink)
  return can && Linking.openURL(deepLink)
}
