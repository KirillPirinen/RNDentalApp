import { createSlice } from '@reduxjs/toolkit'
import themes from '../styles/themes'

export const themeSlice = createSlice({
  name: 'appTheme',
  initialState: 'light',
  reducers: {
    setTheme: (state, action) => themes.hasOwnProperty(action.payload) ? action.payload : state
  }
})

export const { setTheme } = themeSlice.actions

export const getCurrentTheme = state => state.appTheme

export default themeSlice.reducer
