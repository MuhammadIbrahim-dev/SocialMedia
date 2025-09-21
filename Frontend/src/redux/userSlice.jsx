import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosIstance } from "../../axios";

// Fetch user profile
export const fetchUser = createAsyncThunk(
  "users/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.get(`/users/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

// Update profile without avatar
export const updateProfile = createAsyncThunk(
  "users/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.put("/users/me", payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

// Update profile with avatar upload
export const updateProfileWithAvatar = createAsyncThunk(
  "users/updateWithAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.put("/users/me/avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile with avatar");
    }
  }
);

const UsersSlice = createSlice({
  name: "users",
  initialState: {
    current: null,
    status: "idle",
    error: null,
    updateStatus: "idle",
    updateError: null,
  },
  reducers: {
    clearUser: (state) => {
      state.current = null;
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.current = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })
      
      // Update Profile with Avatar
      .addCase(updateProfileWithAvatar.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateProfileWithAvatar.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.current = action.payload.user;
      })
      .addCase(updateProfileWithAvatar.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      });
  },
});

export const { clearUser, clearUpdateError } = UsersSlice.actions;
export default UsersSlice.reducer;
