import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducer/authReducer";
import postReducer from "../redux/reducer/postReducer";





//  Steps for state management
// action
// Submit action
// Handle Action In it's reducer
//  register Here


export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts:postReducer,
  },
});
