import { isSameDay } from "date-fns"
import formatRu from "./formatRu"

export const groupAppointments = (appointments) => {
  const res = []
  let temp = [appointments[0]]

  for (let i = 1; i < appointments.length; i++) {
    const prev = temp[temp.length - 1]
    if(isSameDay(prev.date, appointments[i].date)) {
      temp.push(appointments[i])
    } else {
      res.push(temp)
      temp = [appointments[i]]
    }
  }

  return res
}
