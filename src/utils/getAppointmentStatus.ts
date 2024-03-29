import { APPOINTMENT_STATUS } from '../consts'
import { addMinutes, isAfter, isBefore } from 'date-fns';
import Appointment from '../db/models/Appointment';

export const getAppointmentStatus = (appointment: Appointment) => {

  switch (true) {

    case appointment.isConfirmed: return APPOINTMENT_STATUS.confirmed

    case appointment.isPostponed: return APPOINTMENT_STATUS.skipped

    default: {

      const now = new Date()
      const hasStarted = isAfter(now, appointment.date)
      const hasEnded = !isBefore(now, addMinutes(appointment.date, appointment.duration))

      switch (true) {
        case !hasStarted: return APPOINTMENT_STATUS.future
        case hasStarted && !hasEnded: return APPOINTMENT_STATUS.lasts
        case hasEnded: return APPOINTMENT_STATUS.past

        default: return 'unknown'
      }

    }
  }

}
