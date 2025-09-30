import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginUser, registerUser, logoutUser, getConnectionRequest, getMyconnections } from "@/config/redux/actions/authAction";
import { act } from "react";

const initialState = {
  users: [],          
  token: null,        
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profilefetched: false,
  connections: [],
  connectionRequest: [],
  isTokenThere: false,
  all_users:[],
  allProfileFetched:false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.users = null;
      state.token = null;
      state.loggedIn = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "Logged out successfully";
    },
    resetAuthState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    setIsTokenThere: (state) => {
      state.isTokenThere = true
    },
    setIsTokenNotThere: (state) => {
      state.isTokenThere = false
    },

  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.users = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.message = action.payload?.message || "Registered successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message || "Registration failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.users = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.message = action.payload?.message || "Logged in successfully";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profilefetched = true;  // correct spelling
        state.users = action.payload;   // store the full profile object
        state.connections = action.payload.connections || [];
        state.connectionRequest = action.payload.connectionRequest || [];
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allProfileFetched=true;
        state.all_users = action.payload.profiles;

      })
        .addCase(logoutUser, (state) => {
        localStorage.removeItem("token");
        state.users = null;
        state.token = null;
        state.loggedIn = false;
        state.profilefetched = false;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Logged out successfully";
      })
      .addCase(getConnectionRequest.fulfilled,(state,action)=>{
        // incoming requests to the logged-in user
        state.connections = action.payload
      })
      .addCase(getConnectionRequest.rejected,(state, action)=>{
        state.message = action.payload
      })
      .addCase(getMyconnections.fulfilled,(state,action)=>{
        // outgoing requests from the logged-in user
        state.connectionRequest= action.payload
      })
      .addCase(getMyconnections.rejected,(state,action)=>{
        state.message = action.payload
      })



  },
});

export const { logout, resetAuthState, setIsTokenNotThere, setIsTokenThere } = authSlice.actions;
export default authSlice.reducer;
