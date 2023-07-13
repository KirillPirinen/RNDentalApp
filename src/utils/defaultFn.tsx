import { Model } from "@nozbe/watermelondb"
import { Keyboard } from "react-native"
import { Divider } from "react-native-paper"

export const defaultExtractor = <T extends string | number>(item: { id: T }) => item.id

export const defaultUpdater = <T extends Model>(fields: Record<string, any>) => (instance: T) => {
  for (const key of Object.keys(fields)) {
    instance[key as keyof T] = fields[key]
  }
}

export const renderDefaultDivider = () => <Divider bold />

export const defaultDissmisHandle = () => {
  if (Keyboard.isVisible()) {
    Keyboard.dismiss()
  }
  return true
}
