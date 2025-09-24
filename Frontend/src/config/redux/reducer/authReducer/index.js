import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "@/config/redux/actions/authAction";

const initialState = {
  loggedIn: false,
  loading: false,
  isError: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.message = action.payload?.message || "Registered successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.message = "Logged in successfully";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      });
  },
});

export default authSlice.reducer;
