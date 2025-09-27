import { npmjsserver } from "@/config/axiosInstance";
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";




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