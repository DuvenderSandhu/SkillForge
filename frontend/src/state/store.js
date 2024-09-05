import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserToken'

export const store = configureStore({
  reducer: {
    user:userReducer
  },
})