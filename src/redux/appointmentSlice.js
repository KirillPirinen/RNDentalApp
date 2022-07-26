import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { 
    date: '11 сентября', appointments: [
      { id: '1', avatar:'', name: 'Анжела', lname: 'Матиева', orepations: 'пульпит, удаление зуба', time: '12:30' },
      { id: '2', avatar:'', name: 'Петр', lname: 'Пятрунька', orepations: 'пульпит, удаление зуба', time: '13:30' },
      { id: '3', avatar:'', name: 'Сергей', lname: 'Сярунька', orepations: 'пульпит, удаление зуба', time: '14:30' },
    ]
  },
  { 
    date: '12 сентября', appointments: [
      { id: '4', avatar:'', name: 'Анжела', lname: 'Матиева', orepations: 'пульпит, удаление зуба', time: '12:30' },
      { id: '5', avatar:'', name: 'Петр', lname: 'Пятрунька', orepations: 'пульпит, удаление зуба', time: '13:30' },
      { id: '6', avatar:'', name: 'Сергей', lname: 'Сярунька', orepations: 'пульпит, удаление зуба', time: '14:30' },
    ]
  }
]

export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {}
})

export const getAppointmentsByDay = state => state.appointments

export default appointmentSlice.reducer
