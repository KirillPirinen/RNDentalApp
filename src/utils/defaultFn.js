
export const defaultExtractor = item => item.id

export const defaultUpdater = fields => instance => {
  for(key of Object.keys(fields)) {
    instance[key] = fields[key]
  }
}
