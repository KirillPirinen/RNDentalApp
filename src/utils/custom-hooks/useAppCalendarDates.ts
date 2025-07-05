import { useEffect, useState } from 'react'
import { addMinutes, format } from 'date-fns'
import { MarkedDates } from 'react-native-calendars/src/types'
import { TimelineEventProps } from 'react-native-calendars'
import Appointment from '../../db/models/Appointment'
import Patient from '../../db/models/Patient'
import { t } from '@lingui/core/macro'

export type ExtendedTimelineEventProps = TimelineEventProps & { appointment: Appointment, patient: Patient }

type useAppCalendarDatesApi = {
  markedDates: MarkedDates,
  eventsByDate: Record<string, Array<ExtendedTimelineEventProps>>
  isReady: boolean
}

const calendarDateTimeFormat = 'yyyy-MM-dd HH:mm:ss'

const chooseColor: Record<string, string> = {
  ['#d2ccf2']: '#e4a8b9',
  ['#e4a8b9']: '#e4eeff',
  ['#e4eeff']: '#d2ccf2'
}

const getNewEventColor = (prevEventColor?: string) => {
  return (prevEventColor && chooseColor[prevEventColor]) ?? '#d2ccf2'
}

const parseAppointments = async (appointments: Appointment[]) => {
    const state: useAppCalendarDatesApi = { markedDates: {}, eventsByDate: {}, isReady: true }
    for (const appointment of appointments) {
      const patient = await appointment.patient.fetch() as unknown as Patient
      const rawDate = new Date(appointment.date)
      const dateTime = format(rawDate, calendarDateTimeFormat)
      const date = dateTime.split(' ')[0]
      state.markedDates[date] = { selectedTextColor: 'white', marked: true }

      if (!state.eventsByDate[date]) state.eventsByDate[date] = []
      const events = state.eventsByDate[date]
      const prevEvent = events[events.length - 1]

      state.eventsByDate[date].push({
        start: dateTime,
        end: format(addMinutes(rawDate, appointment.duration), calendarDateTimeFormat),
        //@ts-ignore
        title: t`Прием пациента: ${patient.fullName}`,
        summary: appointment.notes ? `${t`Заметки`}: ${appointment.notes}` : undefined,
        color: getNewEventColor(prevEvent?.color),
        appointment,
        patient
      })
    }
    return state
}

export const useAppCalendarDates = (appointments: Array<Appointment>): useAppCalendarDatesApi => {
  const [state, setState] = useState<useAppCalendarDatesApi>({ markedDates: {}, eventsByDate: {}, isReady: false })

  useEffect(() => {
    parseAppointments(appointments).then(setState)
  }, [appointments])

  return state
}
