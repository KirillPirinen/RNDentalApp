import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import appointmentSlice from './appointmentSlice'
import patientSlice from './patientSlice'

export const store = configureStore({
  reducer: {
    appTheme: themeReducer,
    appointments: appointmentSlice,
    patients: patientSlice
  },
})
