import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username:"",
  token:"",
  email:"",
  role:""
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser:(state,action)=>{
        state.email=action.payload.email
        state.token=action.payload.token
        state.username=action.payload.username
        state.role=action.payload.role
    },
    logOutUser:(state)=>{
        state.email=""
        state.token=""
        state.username=""
        state.role=""
    }
  },
})

// Action creators are generated for each case reducer function
export const {logOutUser,setUser } = counterSlice.actions

export default counterSlice.reducer