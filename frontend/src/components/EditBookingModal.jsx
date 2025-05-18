import { useState } from "react";
import styles from "./EditBookingModal.module.css";

const EditBookingModal = ({ booking, onClose, onUpdate }) => {
  const [newPassengers, setNewPassengers] = useState([]);
  const [passengersToDelete, setPassengersToDelete] = useState([]);

  const toggleDelete = (id) => {
    setPassengersToDelete((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleNewChange = (index, field, value) => {
    setNewPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addNew = () => {
    setNewPassengers((prev) => [
      ...prev,
      { name: "", age: "", gender: "Male" },
    ]);
  };

  const removeNew = (i) => {
    setNewPassengers((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    // Filter out any new passengers with empty fields
    const validNew = newPassengers.filter((p) => p.name && p.age && p.gender);
    onUpdate(validNew, passengersToDelete);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`bg-white p-4 rounded shadow ${styles.modal}`}>
        <h4 className="mb-3">Edit Passengers</h4>

        <h5>Existing Passengers</h5>
        <ul className="list-group mb-3">
          {booking.passengers.map((p) => (
            <li
              key={p._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {p.name} — {p.age} yrs — {p.gender}
              <button
                className={`btn btn-sm ${
                  passengersToDelete.includes(p._id)
                    ? "btn-secondary"
                    : "btn-danger"
                }`}
                onClick={() => toggleDelete(p._id)}
              >
                {passengersToDelete.includes(p._id) ? "Undo" : "Remove"}
              </button>
            </li>
          ))}
        </ul>

        <h5>New Passengers</h5>
        {newPassengers.map((p, i) => (
          <div key={i} className="row g-2 mb-2 align-items-end flex-wrap">
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={p.name}
                onChange={(e) => handleNewChange(i, "name", e.target.value)}
              />
            </div>
            <div className="col-6 col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Age"
                value={p.age}
                onChange={(e) => handleNewChange(i, "age", e.target.value)}
              />
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={p.gender}
                onChange={(e) => handleNewChange(i, "gender", e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <button
                className="btn btn-sm btn-danger w-100"
                onClick={() => removeNew(i)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button className="btn btn-success btn-sm" onClick={addNew}>
          + Add Passenger
        </button>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Update Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
