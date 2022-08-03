import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Петров Петька',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Иванов Ванька',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Юля Дмитриева',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d12',
    name: 'John Doe',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d16',
    name: 'Vin Diesel1',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d17',
    name: 'Vin Diesel2',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d18',
    name: 'Vin Diesel3',
  },
]

export const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {}
})

export const getPatients = state => state.patients

export default patientsSlice.reducer
