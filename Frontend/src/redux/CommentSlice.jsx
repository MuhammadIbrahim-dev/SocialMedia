import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosIstance } from "../../axios";

export const fetchComments = createAsyncThunk(
  "comments/fetchByPost",
  async (postId) => {
    const res = await axiosIstance.get(`/comments/post/${postId}`);
    return res.data;
  }
);

export const addComment = createAsyncThunk(
  "comments/add",
  async ({ postId, content }) => {
    const res = await axiosIstance.post(`/comments/post/${postId}`, { content });
    return res.data;
  }
);

export const fetchCommentsByUser = createAsyncThunk(
  "comments/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.get(`/comments/user/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user comments");
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    userComments: [], // Comments by specific user
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    userCommentsStatus: "idle", // Status for user comments
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchCommentsByUser.pending, (state) => {
        state.userCommentsStatus = "loading";
      })
      .addCase(fetchCommentsByUser.fulfilled, (state, action) => {
        state.userCommentsStatus = "succeeded";
        state.userComments = action.payload;
      })
      .addCase(fetchCommentsByUser.rejected, (state, action) => {
        state.userCommentsStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default commentsSlice.reducer;