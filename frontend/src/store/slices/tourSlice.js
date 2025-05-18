// src/redux/tourSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const apiURL = import.meta.env.VITE_BACKEND_URL;
// Fetch all tours
export const fetchTours = createAsyncThunk(
  "tour/fetchTours",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiURL + "/tours", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tours");
      return data.data.allTours;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch single tour by ID
export const fetchTourById = createAsyncThunk(
  "tour/fetchTourById",
  async (tourId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiURL + `/tours/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tour");
      return data.data.tour;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tourSlice = createSlice({
  name: "tour",
  initialState: {
    tours: [],
    selectedTour: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedTour(state) {
      state.selectedTour = null;
    },
    resetTourState: (state) => {
      state.tours = [];
      state.selectedTour = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTours
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchTourById
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTour = action.payload;
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedTour, resetTourState } = tourSlice.actions;
export default tourSlice.reducer;
