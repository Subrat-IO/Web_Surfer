// actions/postAction/index.js
import { BASE_URL, npmjsserver } from "@/config/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts`);
      return response.data; // directly return array
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error fetching posts");
    }
  }
);


export const getPostById = createAsyncThunk(
  "post/getPostById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${id}`);
      return response.data; // single post object
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch post");
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ file, body }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      if (file) {
        formData.append("media", file); // <-- check if backend expects "media"
      }

      const response = await npmjsserver.post("/post", formData, {
        headers: {
          // ❌ Don't set Content-Type manually
        },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("post uploaded");
      } else {
        return thunkAPI.rejectWithValue("post upload unsuccessful");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async(post_id,thunkAPI)=>{
    try {
      const response = await npmjsserver.delete("/delete_post",{
        data:{
          token:localStorage.getItem("token"),
          post_id:post_id.post_id
        }
      });
        return thunkAPI.fulfillWithValue(response.data) 
      
    } catch (error) {
      
      return thunkAPI.rejectWithValue("invalid Data");1

    
    }
  }
)
