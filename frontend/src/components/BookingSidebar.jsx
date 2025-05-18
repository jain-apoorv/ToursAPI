import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBooking } from "../store/slices/bookingSlice";
import { fetchTourById } from "../store/slices/tourSlice";
import styles from "./BookingSidebar.module.css";

const BookingSidebar = ({ tour, onClose }) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState("");
  const [passengers, setPassengers] = useState([]);
  const [passengerInput, setPassengerInput] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddPassenger = () => {
    const { name, age, gender } = passengerInput;
    if (!name.trim() || !age || !gender) {
      return alert("Please fill all passenger fields.");
    }
    setPassengers((prev) => [...prev, { ...passengerInput }]);
    setPassengerInput({ name: "", age: "", gender: "" });
  };

  const handleRemovePassenger = (idx) => {
    setPassengers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      await dispatch(
        createBooking({
          tourId: tour._id,
          startDate,
          passengers,
        })
      ).unwrap();

      alert("Booking successful!");
      onClose();
    } catch (err) {
      alert(err || "Booking failed. Please try again.");
      dispatch(fetchTourById(tour._id));
    } finally {
      setLoading(false);
      setShowSummary(false);
    }
  };

  const estimatedTotal = passengers.length * tour.price;

  return (
    <>
      <div className={styles.overlay}>
        <div className={`bg-white shadow ${styles.sidebar}`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="m-0">Book “{tour.name}”</h4>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          {/* Start Date */}
          <label>Start Date</label>
          <select
            className="form-select"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a date…</option>
            {tour.startDates.map((date, i) => (
              <option key={date} value={date}>
                {new Date(date).toDateString()} — {tour.spotsLeftPerDate[i]}{" "}
                spots
              </option>
            ))}
          </select>

          {/* Existing Passengers */}
          <h5>Passengers</h5>
          <div className={styles["passenger-list"]}>
            {passengers.length === 0 && (
              <p className="text-muted">No passengers added yet.</p>
            )}
            {passengers.map((p, i) => (
              <div
                key={i}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <span>
                  {p.name} ({p.age}, {p.gender})
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemovePassenger(i)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add Passenger */}
          <div className={styles["add-passenger"]}>
            <h5>Add Passenger</h5>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={passengerInput.name}
                  onChange={(e) =>
                    setPassengerInput((p) => ({ ...p, name: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
              <div className="col-6 col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Age"
                  value={passengerInput.age}
                  onChange={(e) =>
                    setPassengerInput((p) => ({ ...p, age: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select"
                  value={passengerInput.gender}
                  onChange={(e) =>
                    setPassengerInput((p) => ({ ...p, gender: e.target.value }))
                  }
                  disabled={loading}
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-12 d-grid">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAddPassenger}
                  disabled={loading}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <strong>Estimated Total:</strong>
            <span>${estimatedTotal.toLocaleString()}</span>
          </div>

          {/* Book Now */}
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => setShowSummary(true)}
            disabled={!startDate || passengers.length === 0 || loading}
          >
            {loading ? "Processing…" : "Book Now"}
          </button>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h5>Booking Summary</h5>
            <p>
              <strong>Date:</strong> {new Date(startDate).toDateString()}
            </p>
            <h6>Passengers:</h6>
            <ul className="list-group mb-3">
              {passengers.map((p, i) => (
                <li key={i} className="list-group-item">
                  {p.name} ({p.age}, {p.gender})
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <strong>Estimated Total:</strong>
              <span>${estimatedTotal.toLocaleString()}</span>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowSummary(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? "Confirming…" : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingSidebar;
