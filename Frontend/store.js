import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './src/redux/AuthSlice/Auth.Slice.jsx'

export const Store = configureStore({
    reducer:{
        auth : AuthReducer
    }
})