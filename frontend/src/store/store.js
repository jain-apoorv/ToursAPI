// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tourReducer from "./slices/tourSlice";
import bookingReducer from "./slices/bookingSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    tour: tourReducer,
    booking: bookingReducer,
  },
});

export default store;
