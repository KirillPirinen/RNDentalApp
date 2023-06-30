import { Q } from '@nozbe/watermelondb'
import randomId from '@nozbe/watermelondb/utils/common/randomId'

export const getSqlDateFn = ({ modifier, from } = {}) => {
  from = from || 'now'

  if (!modifier) {
    return `date('${from}')`
  }
  const str = modifier > 0 ? `+${modifier}` : modifier
  return `date('${from}', '${str} day')`
}

export const appointmentsByDays = ({
  from,
  to,
  unconfirmed
}) => {
  const fromDate = getSqlDateFn({ modifier: from })
  const toDate = getSqlDateFn({ modifier: to })

  return Q.unsafeSqlQuery(`
    SELECT appointments.*, date(appointments.date / 1000, 'unixepoch') AS formatted FROM appointments 
    WHERE (_status != 'deleted')
    AND (formatted BETWEEN ${fromDate} AND ${toDate})
    ${unconfirmed ? `OR (appointments._status != 'deleted' AND appointments.is_confirmed = false AND formatted < ${toDate})` : ''}
    ORDER BY appointments.date ASC;`
  )
}

export const getScheduledPatiens = () => Q.unsafeSqlQuery(`
  SELECT patients.* FROM patients
  INNER JOIN appointments ON patients.id = appointments.patient_id
  WHERE appointments._status != 'deleted'
  ORDER BY appointments.created_at DESC
`)

export const insertSettings = (object) => {
  const baseSql = 'INSERT INTO settings (id, name, value) VALUES'
  const keys = Object.keys(object)

  let result = keys.slice(0, -1).reduce((acc, settingName) => {
    acc += ` ("${randomId()}", "${settingName}", '${JSON.stringify(object[settingName])}'),`
    return acc
  }, baseSql)

  const lastSetting = keys[keys.length - 1]

  if (lastSetting) result += ` ("${randomId()}", "${lastSetting}", '${JSON.stringify(object[lastSetting])}');`

  return result !== baseSql ? result : ''
}

export const findById = (id, table) => Q.unsafeSqlQuery(`
  SELECT * FROM "${table}" WHERE id = "${id}";
`)
