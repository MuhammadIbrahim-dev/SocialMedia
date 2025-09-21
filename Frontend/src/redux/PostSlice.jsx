import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosIstance } from "../../axios";


export const fetchPosts = createAsyncThunk("posts/fetchAll", async () => {
  const res = await axiosIstance.get("/posts");
  return res.data;
});

export const fetchPost = createAsyncThunk("posts/fetchOne", async (id) => {
  const res = await axiosIstance.get(`/posts/${id}`);
  return res.data;
});

export const createPost = createAsyncThunk("posts/create", async (payload) => {
  const res = await axiosIstance.post("/posts", payload);
  return res.data;
});

export const votePost = createAsyncThunk("posts/vote", async ({ id, value }) => {
  const res = await axiosIstance.post(`/posts/${id}/vote`, { value });
  return res.data;
});

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, ...payload }) => {
    const res = await axiosIstance.put(`/posts/${id}`, payload);
    return res.data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await axiosIstance.delete(`/posts/${postId}`);
      return postId; // Return the id to identify which post to remove
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const PostsSlice = createSlice({
  name: "posts",
  initialState: { items: [], current: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(votePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
        if (state.current?._id === action.payload) {
          state.current = null;
        }
      });
  },
});

export default PostsSlice.reducer;
