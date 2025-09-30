import { createSlice } from "@reduxjs/toolkit";
import { deletePost, getAllPosts, postComment } from "@/config/redux/actions/postAction";
import { likePostAction } from "@/config/redux/actions/postAction";
const initialState = {
  posts: [],
  comments: [],          // all posts
  isError: false,
  isSuccess: false,
  isLoading: false,
  postFetched: false,
  message: "",
  postId: "",          // optional: for single post actions
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
    builder.addCase(likePostAction.fulfilled, (state, action) => {
      const { post_id, likes } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === post_id);
      if (postIndex !== -1) {
        state.posts[postIndex].likes = likes;
      }
    })
    builder.addCase(postComment.fulfilled, (state, action) => {
      const { post_id, comment } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === post_id);
      if (postIndex !== -1) {
        if (!state.posts[postIndex].comments) state.posts[postIndex].comments = [];
        state.posts[postIndex].comments.push(comment);
      }
    });




  },
});

export const { resetPosts, resetPostId } = postSlice.actions;
export default postSlice.reducer;
