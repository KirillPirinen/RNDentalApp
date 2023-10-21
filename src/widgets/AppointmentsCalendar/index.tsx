import React, { useMemo, useState } from 'react';
import {
  ExpandableCalendar,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  LocaleConfig,
  CalendarUtils,
} from 'react-native-calendars';
import { ExtendedTimelineEventProps, useAppCalendarDates } from '../../utils/custom-hooks/useAppCalendarDates';
import Appointment from '../../db/models/Appointment';
import { useNavigation } from '@react-navigation/native';
import { useGeneralControl } from '../../context/general-context';
import { ru } from './lib/locale';

LocaleConfig.locales['ru'] = ru
LocaleConfig.defaultLocale = 'ru';

export type AppCalendarProps = {
  appointments: Array<Appointment>
}

export const AppointmentsCalendar: React.FC<AppCalendarProps> = ({ appointments }) => {
  const navigation = useNavigation()
  const [actions, dispatch] = useGeneralControl()
  const { markedDates, eventsByDate, isReady } = useAppCalendarDates(appointments)
  const [currentDate, setCurrentDate] = useState(() => CalendarUtils.getCalendarDateString(Date.now()))

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
  }, [navigation, dispatch])

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
}
