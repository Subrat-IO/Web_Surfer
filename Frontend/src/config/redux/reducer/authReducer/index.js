import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../actions/authAction";

const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    isLoggedIn: false,
    message: "",
    profileFectched: false,
    connections: [],
    connectionRequest: []
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        extraReducers: (builder) => {
            builder
                .addCase(loginUser.pending, (state) => {
                    state.isLoading = true
                    state.message = "Knocking The door..."
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.isLoading = false,
                        state.isError = false,
                        state.isSuccess = false,
                        state.isLoggedIn = true,
                        state.message = "login is successful"

                })

                .addCase(loginUser.rejected, (state, action) => {
                    state.isLoading = false,
                        state.isError = true,
                        state.message = action.payload
                })
                .addCase(registerUser.pending, (state) => {
                    state.isLoading = true,
                        state.message = "registering you.."
                })
                .addCase(registerUser.fulfilled, (state) => {
                    state.isLoading = false;
                    state.isError = false;
                    state.isSuccess = true;
                    state.isLoggedIn = true;
                    state.message = "registration done you can access";
                })
                .addCase(registerUser.rejected, (state) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                })
        }
    }
})


export default authSlice.reducer;