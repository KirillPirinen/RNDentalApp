import { isSameDay } from "date-fns"
import { APPOINTMENT_STATUS } from "./constants"
import formatRu from "./formatRu"
import { getAppointmentStatus } from "./getAppointmentStatus"

// let prepearedStatus = false
  
// const injectAppointmentStatus = (appointment) => {
//   appointment.status = prepearedStatus || getAppointmentStatus(appointment)

//   if(appointment.status === APPOINTMENT_STATUS.future) {
//     prepearedStatus = 'future'
//   }

//   return appointment
// }

const getDayContent = (appointment) => ({
    day: formatRu(appointment.date, 'do MMMM, EEEE'),
    data: [appointment]
  })

export const groupAppointments = (appointments) => {

  //if (!appointments.length) return appointments

  const res = []

  let temp = getDayContent(appointments[0])

  for (let i = 1; i < appointments.length; i++) {
    const prev = temp.data[temp.data.length - 1]

    if(isSameDay(prev.date, appointments[i].date)) {
      temp.data.push(appointments[i])
      continue
    } 
    
    res.push(temp)
    temp = getDayContent(appointments[i])

  }

  if(!res.length) res.push(temp)
  
  return res
}
