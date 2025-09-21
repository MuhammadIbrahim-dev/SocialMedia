import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosIstance } from "../../axios";

// ======================
// Async Thunks
// ======================

// Fetch all posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.get("/posts");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch posts");
    }
  }
);

// Fetch posts by user ID
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.get(`/posts/user/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user posts");
    }
  }
);

// Fetch single post
export const fetchPost = createAsyncThunk(
  "posts/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.get(`/posts/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch post");
    }
  }
);

// Create new post
export const createPost = createAsyncThunk(
  "posts/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.post("/posts", payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create post");
    }
  }
);

// Vote on a post
export const votePost = createAsyncThunk(
  "posts/vote",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.post(`/posts/${id}/vote`, { value });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to vote");
    }
  }
);

// Update a post
export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.put(`/posts/${id}`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update post");
    }
  }
);

// Delete a post
export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await axiosIstance.delete(`/posts/${postId}`);
      return postId; // Return the id to identify which post to remove
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete post");
    }
  }
);

// ======================
// Slice
// ======================
const PostsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    userPosts: [], // Posts by specific user
    current: null,
    status: "idle",   // idle | loading | succeeded | failed
    userPostsStatus: "idle", // Status for user posts
    error: null,
    updateStatus: "idle", // idle | loading | succeeded | failed
    deleteStatus: "idle", // idle | loading | succeeded | failed
  },
  reducers: {
    clearCurrentPost: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ======================
      // Fetch All
      // ======================
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ======================
      // Fetch Posts by User
      // ======================
      .addCase(fetchPostsByUser.pending, (state) => {
        state.userPostsStatus = "loading";
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.userPostsStatus = "succeeded";
        state.userPosts = action.payload;
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.userPostsStatus = "failed";
        state.error = action.payload;
      })

      // ======================
      // Fetch One
      // ======================
      .addCase(fetchPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ======================
      // Create
      // ======================
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // ======================
      // Vote
      // ======================
      .addCase(votePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })

      // ======================
      // Update
      // ======================
      .addCase(updatePost.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      })

      // ======================
      // Delete
      // ======================
      .addCase(deletePost.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((p) => p._id !== action.payload);
        if (state.current?._id === action.payload) {
          state.current = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearCurrentPost } = PostsSlice.actions;

// Export reducer
export default PostsSlice.reducer;
