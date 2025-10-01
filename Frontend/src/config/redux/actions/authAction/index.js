import { npmjsserver } from "@/config/axiosInstance";
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { use } from "react";




// LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await npmjsserver.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        return thunkAPI.fulfillWithValue(response.data);
      } else {
        return thunkAPI.rejectWithValue({ message: "Token not provided" });
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await npmjsserver.post("/register", {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);



export const getAboutUser = createAsyncThunk(
  "/user/getAboutUser",
  async ({ token }, thunkAPI) => {
    try {
      console.log("Token sent to backend:", token);
      const response = await npmjsserver.get("/get_user_and_profile", {
        params: { token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error fetching user");
    }
  }
);


export const getAllUsers = createAsyncThunk(
  "/user/get_all_users",
  async (_, thunkAPI) => {
    try {
      const response = await npmjsserver.get("/user/get_all_users");

      return thunkAPI.fulfillWithValue(response.data);
    }
    catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }

)


export const logoutUser = createAction("user/logout");


// ✅ Send connection request
export const SendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await npmjsserver.post("/user/send_request", {
        token: user.token,
        connectionId: user.userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ Get incoming requests
export const getConnectionRequest = createAsyncThunk(
  "/user/get_requests",
  async (user, thunkAPI) => {
    try {
      const response = await npmjsserver.get("/user/get_connection_request", {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ Get my connections (incoming + outgoing)
export const getMyconnections = createAsyncThunk(
  "/user/GetConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await npmjsserver.get("/user/user_connection_request", {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ Accept or reject request
export const acceptConnections = createAsyncThunk(
  "/user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await npmjsserver.post("/user/accept_connection_request", {
        token: user.token,
        requestId: user.requestId,
        connection_id: user.connectionId,
        action_type: user.action,
      });

      // If rejected → also delete from backend
      if (user.action === "reject") {
        await npmjsserver.post("/user/delete_connection", {
          token: user.token,
          requestId: user.requestId,
          connectionId: user.connectionId,
        });
      }

      return thunkAPI.fulfillWithValue({
        ...response.data,
        action: user.action,
        requestId: user.requestId,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

// ✅ Delete connection (for cancel or remove)
export const deleteConnection = createAsyncThunk(
  "/user/deleteConnection",
  async (user, thunkAPI) => {
    try {
      const response = await npmjsserver.post("/user/delete_connection", {
        token: user.token,
        connectionId: user.connectionId,
      });
      return thunkAPI.fulfillWithValue({
        ...response.data,
        requestId: user.requestId,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);
