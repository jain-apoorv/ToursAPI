import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../store/slices/bookingSlice";
import styles from "./MyBookings.module.css";
import retrunArrow from "../assets/arrow-return-left.svg";

const MyBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookings, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleViewDetails = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <div className={`container py-4 ${styles.myBookings}`}>
      <button
        className="btn btn-outline-secondary mb-3 d-flex align-items-center gap-2"
        onClick={() => navigate("/tours")}
      >
        <img src={retrunArrow} alt="Back" width="20" height="20" />
        <span>Back to Tours</span>
      </button>

      <h1 className="mb-4 fw-bold text-primary">My Bookings</h1>

      {loading && <p>Loading your bookings…</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && bookings.length === 0 && (
        <p>No bookings yet. Start exploring tours and make a booking!</p>
      )}

      <div className="row">
        {bookings.map((booking) => (
          <div key={booking._id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-secondary">
                  {booking.tour.name}
                </h5>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(booking.startDate).toDateString()}
                </p>
                <p>
                  <strong>Passengers:</strong> {booking.passengers.length}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewDetails(booking._id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
