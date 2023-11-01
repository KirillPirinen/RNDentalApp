import React, { memo, useMemo, useState } from 'react';
import {
  ExpandableCalendar,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  DateData,
  CalendarUtils,
} from 'react-native-calendars';
import { ExtendedTimelineEventProps, useAppCalendarDates } from '../../utils/custom-hooks/useAppCalendarDates';
import Appointment from '../../db/models/Appointment';
import { useNavigation } from '@react-navigation/native';
import { useGeneralControl } from '../../context/general-context';
import { setCalendarLocale } from './lib/locale';
import { appConfigSync } from '../../consts/config';

export type AppCalendarProps = {
  appointments: Array<Appointment>
  onMonthChange?: (date: DateData) => void
}

export const AppointmentsCalendar: React.FC<AppCalendarProps> = memo(({ appointments, onMonthChange }) => {
  setCalendarLocale(appConfigSync.lang)
  const [currentDate, setCurrentDate] = useState(() => CalendarUtils.getCalendarDateString(Date.now()))
  const navigation = useNavigation()
  const [actions, dispatch] = useGeneralControl()
  const { markedDates, eventsByDate } = useAppCalendarDates(appointments)

  // @ts-ignore
  const timelineProps: Partial<TimelineProps> = useMemo(() => {
    return {
      format24h: true,
      onBackgroundLongPress: (timeString) => {
        navigation.navigate('AddAppointment', { startDate: new Date(timeString) })
      },
      onEventPress: (e: ExtendedTimelineEventProps) => {
        dispatch({
          type: actions.PATIENT_APPOINTMENT_DETAILS,
          payload: { patient: e.patient, appointment: e.appointment }
        })
      },
      scrollToFirst: true,
      overlapEventsSpacing: 8,
      rightEdgeSpacing: 24,
    }
  }, [navigation, dispatch, eventsByDate])

    return (
      <CalendarProvider
        date={currentDate}
        onDateChanged={setCurrentDate}
        showTodayButton
        disabledOpacity={0.6}
      >
        <ExpandableCalendar
          firstDay={1}
          leftArrowImageSource={require('../../assets/previous.png')}
          rightArrowImageSource={require('../../assets/next.png')}
          markedDates={markedDates}
          onMonthChange={onMonthChange}
          closeOnDayPress
        />
        <TimelineList
          events={eventsByDate}
          timelineProps={timelineProps}
          showNowIndicator
          scrollToNow
          scrollToFirst
        />
      </CalendarProvider>
    );
})
