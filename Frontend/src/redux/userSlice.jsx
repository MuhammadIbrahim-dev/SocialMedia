import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosIstance } from "../../axios";

export const fetchUser = createAsyncThunk("users/fetchOne", async (id) => {
  const res = await axiosIstance.get(`/users/${id}`);
  return res.data;
});

export const updateProfile = createAsyncThunk("users/update", async (payload) => {
  const res = await axios.put("/users/me", payload);
  return res.data;
});

const UsersSlice = createSlice({
  name: "users",
  initialState: { current: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export default UsersSlice.reducer;
