import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import appointmentSlice from './appointmentSlice'

export const store = configureStore({
  reducer: {
    appTheme: themeReducer,
    appointments: appointmentSlice
  },
})
