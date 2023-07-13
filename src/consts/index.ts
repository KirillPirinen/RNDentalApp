import * as FileSystem from 'expo-file-system';

export const toothStates = {
  pulpitis: 'pulpitis',
  caries: 'caries',
  artificial: 'artificial',
  absent: 'absent',
  root: 'root',
  crown: 'crown',
  periodontitis: 'periodontitis'
}

export const APPOINTMENT_STATUS = {
  confirmed: 'confirmed',
  skipped: 'skipped',
  past: 'past',
  lasts: 'lasts',
  future: 'future',
  ended: 'ended'
}

export const CONTACT_SYNC_STRATEGY = {
  ask: 'ask',
  never: 'never',
  always: 'always'
}

export const TAG_REGEX = /\[-(.*?)-]/

export const DEFAULT_SETTINGS = {
  trackingInterval: { from: 0, to: 14, unconfirmed: true },
  teethColorFill: { statusLocalis: true, history: true },
  activityButton: { helperText: true },
  sync: { contactStrategyType: CONTACT_SYNC_STRATEGY.ask }
}

export const mimeTypes = {
  txt: 'text/plain',
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export const DEFAULT_DB_NAME = 'dental_app_v2' 
export const APP_DATA_DIR = `${FileSystem.documentDirectory}__AppData`
export const IMPORTED_DB_PATH = `${APP_DATA_DIR}/importedDB`

export type AllowedSettings = typeof DEFAULT_SETTINGS

export type AppotmentStatuses = keyof typeof APPOINTMENT_STATUS
