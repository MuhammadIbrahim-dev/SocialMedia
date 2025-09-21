import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosIstance } from "../../axios";

export const fetchLeaderboard = createAsyncThunk("leaderboard/fetch", async () => {
  const res = await axiosIstance.get("/leaderboard");
  return res.data;
});

const LeaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: { users: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLeaderboard.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  },
});

export default LeaderboardSlice.reducer;
