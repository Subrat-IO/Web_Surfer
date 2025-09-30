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

export const likePostAction = createAsyncThunk(
  "post/like_post",
  async ({ token, post_id }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/like_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, post_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData.message || "Failed to like post");
      }

      const data = await response.json();
      return data; // { post_id, likes }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const postComment = createAsyncThunk(
  "post/add_comment",
  async ({ token, post_id, comment_text }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/add_comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, post_id, commentBody: comment_text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData.message || "Failed to post comment");
      }

      const data = await response.json();
      return { post_id, comment: data.comment };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
