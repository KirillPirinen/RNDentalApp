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

export const TAG_REGEX = /\[\-(.*?)\-]/

export const DEFAULT_SETTINGS = {
  trackingInterval: { from: 0, to: 14, unconfirmed: true },
  teethColorFill: { statusLocalis: true, history: true },
  activityButton: { helperText: true },
  sync: { contactStrategyType: CONTACT_SYNC_STRATEGY.ask }
}
