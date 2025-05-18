// src/store/slices/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTourById, fetchTours } from "./tourSlice";
const apiURL = import.meta.env.VITE_BACKEND_URL;
// Fetch the current user's bookings
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiURL + "/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");
      return data.data.bookings;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create a new booking
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async ({ tourId, startDate, passengers }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiURL + `/tours/${tourId}/createBooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tour: tourId, startDate, passengers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      // refresh tours so spotsLeftPerDate is updated
      dispatch(fetchTourById(tourId));
      dispatch(fetchTours());
      return data.data.booking;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update passengers on a booking
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async (
    { bookingId, passengersToAdd, passengersToDelete },
    { rejectWithValue, dispatch, getState }
  ) => {
    const token = localStorage.getItem("token");
    const { selectedTour } = getState().tour;
    try {
      const res = await fetch(apiURL + `/bookings/${bookingId}/updatePeople`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ passengersToAdd, passengersToDelete }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      // refresh tours & bookings
      if (selectedTour) dispatch(fetchTourById(selectedTour._id));
      dispatch(fetchTours());
      dispatch(fetchBookings());
      return data.data.booking;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Cancel a booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async ({ bookingId }, { rejectWithValue, dispatch, getState }) => {
    const token = localStorage.getItem("token");
    const { selectedTour } = getState().tour;
    try {
      const res = await fetch(apiURL + `/bookings/${bookingId}/cancel`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cancel failed");
      // refresh tours & bookings
      if (selectedTour) dispatch(fetchTourById(selectedTour._id));
      dispatch(fetchTours());
      dispatch(fetchBookings());
      return bookingId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetBookingState: (state) => {
      state.bookings = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createBooking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateBooking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.bookings.findIndex(
          (b) => b._id === action.payload._id
        );
        if (idx > -1) state.bookings[idx] = action.payload;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // cancelBooking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
export const { resetBookingState } = bookingSlice.actions;
