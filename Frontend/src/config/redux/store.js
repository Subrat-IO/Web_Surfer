import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducer/authReducer";





//  Steps for state management
// action
// Submit action
// Handle Action In it's reducer
//  register Here


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
