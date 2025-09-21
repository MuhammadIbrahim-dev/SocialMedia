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

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
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
      });
  },
});

export default commentsSlice.reducer;