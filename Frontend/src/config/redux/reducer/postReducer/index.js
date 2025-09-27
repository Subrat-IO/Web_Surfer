import { createSlice } from "@reduxjs/toolkit";
import { deletePost,getAllPosts } from "@/config/redux/actions/postAction";

const initialState = {
  posts: [],           // all posts
  isError: false,
  isSuccess: false,
  isLoading: false,
  postFetched: false,
  message: "",
  post_Id: "",          // optional: for single post actions
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetPosts: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Fetching all posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.postFetched = true;
        state.posts = action.payload.posts || []; // <-- match API
        state.message = "Posts fetched successfully";
      })

      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.posts || "Failed to fetch posts";
      })
     
 

  },
});

export const { resetPosts, resetPostId } = postSlice.actions;
export default postSlice.reducer;
