import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  cancelBooking,
  updateBooking,
} from "../store/slices/bookingSlice";
import styles from "./BookingDetails.module.css";
import EditBookingModal from "./EditBookingModal";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { bookings, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const booking = bookings.find((b) => b._id === id);

  if (loading) {
    return <h2 className="text-center text-primary mt-5">Loading booking…</h2>;
  }

  if (error) {
    return (
      <h2 className="text-center text-danger mt-5">
        Error loading booking: {error}
      </h2>
    );
  }

  if (!booking) {
    return <h2 className="text-center text-danger mt-5">Booking not found</h2>;
  }

  const handleCancel = () => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    dispatch(cancelBooking({ bookingId: id })).then((action) => {
      if (action.type === "booking/cancelBooking/fulfilled") {
        alert("Booking cancelled successfully.");
        navigate("/bookings");
      } else {
        alert(action.payload || "Failed to cancel booking.");
      }
    });
  };

  return (
    <div className={`container py-4 ${styles.bookingDetails}`}>
      <h1 className="mb-4 fw-bold text-primary">Booking Details</h1>
      <h4>{booking.tour.name}</h4>
      <p>
        <strong>Start Date:</strong>{" "}
        {new Date(booking.startDate).toDateString()}
      </p>
      <h5>Passengers</h5>
      <ul>
        {booking.passengers.map((p) => (
          <li key={p._id}>
            {p.name} — {p.age} years old ({p.gender})
          </li>
        ))}
      </ul>

      <button
        className="btn btn-primary mt-3 me-2"
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit Passengers
      </button>

      <button className="btn btn-danger mt-3" onClick={handleCancel}>
        Cancel Booking
      </button>

      {isEditModalOpen && (
        <EditBookingModal
          booking={booking}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(passengersToAdd, passengersToDelete) => {
            dispatch(
              updateBooking({
                bookingId: id,
                passengersToAdd,
                passengersToDelete,
              })
            ).then((action) => {
              if (action.type === "booking/updateBooking/fulfilled") {
                alert("Passengers updated!");
                setIsEditModalOpen(false);
              } else {
                alert(action.payload || "Update failed.");
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default BookingDetails;
