import { isSameDay } from 'date-fns'
import format from './formatLocalized'
import Appointment from '../db/models/Appointment'

const getDayContent = (appointment: Appointment) => ({
  day: format(appointment.date, 'do MMMM, EEEE'),
  data: [appointment]
})

export const groupAppointments = (appointments: Appointment[]) => {
  if (!appointments.length) return appointments

  const res = []

  let temp = getDayContent(appointments[0])

  for (let i = 1; i < appointments.length; i++) {
    const prev = temp.data[temp.data.length - 1]

    if (isSameDay(prev.date, appointments[i].date)) {
      temp.data.push(appointments[i])
      continue
    }

    res.push(temp)
    temp = getDayContent(appointments[i])
  }

  res.push(temp)

  return res
}
