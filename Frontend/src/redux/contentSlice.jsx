import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosIstance } from "../../axios";

// Generate content based on title
export const generateContent = createAsyncThunk(
  "content/generate",
  async ({ title, style }, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.post("/content/generate", { title, style });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate content");
    }
  }
);

// Generate multiple content suggestions
export const generateSuggestions = createAsyncThunk(
  "content/suggestions",
  async ({ title }, { rejectWithValue }) => {
    try {
      const res = await axiosIstance.post("/content/suggestions", { title });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate suggestions");
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: {
    generatedContent: null,
    suggestions: [],
    status: "idle", // idle | loading | succeeded | failed
    suggestionsStatus: "idle", // idle | loading | succeeded | failed
    error: null,
    suggestionsError: null,
  },
  reducers: {
    clearContent: (state) => {
      state.generatedContent = null;
      state.error = null;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
      state.suggestionsError = null;
    },
    clearAll: (state) => {
      state.generatedContent = null;
      state.suggestions = [];
      state.error = null;
      state.suggestionsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Content
      .addCase(generateContent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.generatedContent = action.payload;
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Generate Suggestions
      .addCase(generateSuggestions.pending, (state) => {
        state.suggestionsStatus = "loading";
        state.suggestionsError = null;
      })
      .addCase(generateSuggestions.fulfilled, (state, action) => {
        state.suggestionsStatus = "succeeded";
        state.suggestions = action.payload.suggestions;
      })
      .addCase(generateSuggestions.rejected, (state, action) => {
        state.suggestionsStatus = "failed";
        state.suggestionsError = action.payload;
      });
  },
});

export const { clearContent, clearSuggestions, clearAll } = contentSlice.actions;
export default contentSlice.reducer;
