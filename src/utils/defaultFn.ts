import { Model } from "@nozbe/watermelondb"

export const defaultExtractor = <T extends string | number>(item: { id: T }) => item.id

export const defaultUpdater = <T extends Model>(fields: Record<string, any>) => (instance: T) => {
  for (const key of Object.keys(fields)) {
    instance[key as keyof T] = fields[key]
  }
}
