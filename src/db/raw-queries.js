import { Q } from '@nozbe/watermelondb';

export const getSqlDateFn = ({ modifier, from } = {}) => {
  from = from || 'now'

  if(!modifier) {
    return `date('${from}')`
  }  
  const str = modifier > 0 ? `+${modifier}` : modifier
  return `date('${from}', '${str}  day')`
}

export const appointmentsByDays = (from, to) => Q.unsafeSqlQuery(`
  SELECT * FROM appointments 
  WHERE (_status != 'deleted')
  AND (date(date / 1000, 'unixepoch') BETWEEN ${getSqlDateFn({ modifier: from })} AND ${getSqlDateFn({ modifier: to })})
  OR (_status != 'deleted' AND is_confirmed = false)
  ORDER BY date ASC;`
)

export const getTeethWithNoHistory = (id) => Q.unsafeSqlQuery(`
  SELECT * FROM teeth 
  LEFT JOIN appointments_teeth AS records ON teeth.id = records.tooth_id
  WHERE teeth._status is not 'deleted' AND records.appointment_id = '${id}' 
  AND (
    SELECT count(*) FROM appointments_teeth 
    WHERE teeth.id = appointments_teeth.tooth_id) = 1
`)

export const updateTeethState = (id) => Q.unsafeSqlQuery(`
  UPDATE teeth SET tooth_state = 'cleaned' WHERE teeth.id IN (
    SELECT teeth.id
    FROM teeth 
    LEFT JOIN appointments_teeth AS records ON teeth.id = records.tooth_id
    WHERE records.appointment_id = '${id}' AND (
      SELECT COUNT(appointments_teeth.id) FROM appointments_teeth WHERE teeth.id = appointments_teeth.tooth_id
    ) = 1
  )
`)
