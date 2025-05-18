import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LoginForm from "./components/LoginForm.jsx";
import SignupForm from "./components/SignupForm.jsx";
import HomePage from "./components/HomePage.jsx";
import ToursAlbum from "./components/ToursAlbum.jsx";
import TourDetail from "./components/TourDetail.jsx";
import MyBookings from "./components/MyBookings.jsx";
import BookingDetails from "./components/BookingDetails.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Hero from "./components/Hero.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      { path: "/", element: <Hero></Hero> },
      { path: "/login", element: <LoginForm /> },
      { path: "/signup", element: <SignupForm /> },
      {
        path: "/tours",
        element: (
          <PrivateRoute>
            <ToursAlbum />
          </PrivateRoute>
        ),
      },
      {
        path: "/tours/:id",
        element: (
          <PrivateRoute>
            <TourDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "/bookings",
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
      {
        path: "/bookings/:id",
        element: (
          <PrivateRoute>
            <BookingDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>
);
