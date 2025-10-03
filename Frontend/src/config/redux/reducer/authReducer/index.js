  import { createSlice } from "@reduxjs/toolkit";
  import {
    getAboutUser,
    getAllUsers,
    loginUser,
    registerUser,
    logoutUser,
    getConnectionRequest,
    getMyconnections,
    acceptConnections,
    deleteConnection,
  } from "@/config/redux/actions/authAction";

  const getToken = () => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  };

  const initialState = {
    users: null,
    token: getToken(),
    loggedIn: !!getToken(),
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    profilefetched: false,
    allConnections: [], // ✅ combine accepted, incoming, sent
    all_users: [],
    allProfileFetched: false,
    isTokenThere: !!getToken(),
  };

  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        if (typeof window !== "undefined") localStorage.removeItem("token");
        state.users = null;
        state.token = null;
        state.loggedIn = false;
        state.profilefetched = false;
        state.allConnections = [];
        state.isTokenThere = false;
        state.message = "Logged out successfully";
      },
      resetAuthState: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
      },
      setIsTokenThere: (state) => {
        state.isTokenThere = true;
        state.loggedIn = true;
      },
      setIsTokenNotThere: (state) => {
        state.isTokenThere = false;
        state.loggedIn = false;
      },
    },
    extraReducers: (builder) => {
      builder
        // REGISTER
        .addCase(registerUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.loggedIn = true;
          state.isTokenThere = true;
          state.users = action.payload?.user || null;
          state.token = action.payload?.token || null;
          if (typeof window !== "undefined" && action.payload?.token)
            localStorage.setItem("token", action.payload.token);
          state.message = action.payload?.message || "Registered successfully";
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload?.message || "Registration failed";
        })

        // LOGIN
        .addCase(loginUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.loggedIn = true;
          state.users = action.payload?.user || null;
          state.token = action.payload?.token || null;
          if (typeof window !== "undefined" && action.payload?.token)
            localStorage.setItem("token", action.payload.token);
          state.message = action.payload?.message || "Logged in successfully";
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload?.message || "Login failed";
        })

        // GET LOGGED-IN USER
        .addCase(getAboutUser.fulfilled, (state, action) => {
          state.users = action.payload || state.users;
          state.allConnections = action.payload?.connections || [];
          if (action.payload?.connectionRequest)
            state.allConnections = [
              ...state.allConnections,
              ...action.payload.connectionRequest,
            ];
          state.profilefetched = true;
          state.loggedIn = true;
        })

        // GET ALL USERS
        .addCase(getAllUsers.fulfilled, (state, action) => {
          state.all_users = action.payload?.profiles || [];
          state.allProfileFetched = true;
        })

        // LOGOUT
        .addCase(logoutUser, (state) => {
          if (typeof window !== "undefined") localStorage.removeItem("token");
          state.users = null;
          state.token = null;
          state.loggedIn = false;
          state.profilefetched = false;
          state.allConnections = [];
          state.isTokenThere = false;
        })

        
        // Accept connection
        .addCase(acceptConnections.fulfilled, (state, action) => {
          const updated = state.allConnections.map((c) =>
            c._id === action.payload._id ? action.payload : c
          );
          state.allConnections = updated;
        })

        // Delete connection
        .addCase(deleteConnection.fulfilled, (state, action) => {
          state.allConnections = state.allConnections.filter(
            (c) => c._id !== action.payload._id
          );
        })// GET CONNECTIONS (incoming + outgoing)
        .addCase(getConnectionRequest.fulfilled, (state, action) => {
          const connections = action.payload || [];
          const ids = new Set(state.allConnections.map((c) => c._id));
          const newConnections = connections.filter((c) => !ids.has(c._id));
          state.allConnections = [...state.allConnections, ...newConnections];
        })
        .addCase(getMyconnections.fulfilled, (state, action) => {
          const connections = action.payload || [];
          const ids = new Set(state.allConnections.map((c) => c._id));
          const newConnections = connections.filter((c) => !ids.has(c._id));
          state.allConnections = [...state.allConnections, ...newConnections];
        })

    },
  });

  export const { logout, resetAuthState, setIsTokenThere, setIsTokenNotThere } =
    authSlice.actions;

  export default authSlice.reducer;
