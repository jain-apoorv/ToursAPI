import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetBookingState } from "./bookingSlice";
import { resetTourState } from "./tourSlice";

const saveToLocalStorage = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

const clearLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status !== "success") {
        return rejectWithValue(data.message || "Login failed");
      }

      saveToLocalStorage(data.user, data.token);
      return { user: data.user, token: data.token };
    } catch (err) {
      return rejectWithValue("Network error");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/v1/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.confPassword,
        }),
      });

      const data = await res.json();

      if (data.status !== "success") {
        return rejectWithValue(data.message || "Signup failed");
      }

      return "Signup successful";
    } catch (err) {
      return rejectWithValue("Network error");
    }
  }
);

export const logoutAndReset = () => (dispatch) => {
  clearLocalStorage();
  dispatch(logoutUser()); // From authSlice
  dispatch(resetBookingState()); // From bookingSlice
  dispatch(resetTourState()); // From tourSlice
};

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      clearLocalStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
