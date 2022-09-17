import { Q } from '@nozbe/watermelondb';

export const getSqlDateFn = ({ modifier, from } = {}) => {
  from = from || 'now'

  if(!modifier) {
    return `date('${from}')`
  }  
  const str = modifier > 0 ? `+${modifier}` : modifier
  return `date('${from}', '${str}  day')`
}

export const appointmentsByDays = (from, to) => Q.unsafeSqlQuery(`SELECT * FROM appointments 
  WHERE date(date / 1000, 'unixepoch') 
  BETWEEN ${getSqlDateFn({ modifier: from })} 
  AND ${getSqlDateFn({ modifier: to })} 
  ORDER BY date ASC;`)
