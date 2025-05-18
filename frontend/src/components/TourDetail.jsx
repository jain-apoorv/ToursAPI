import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTourById } from "../store/slices/tourSlice";
import styles from "./TourDetail.module.css";
import retrunArrow from "../assets/arrow-return-left.svg";
import BookingSidebar from "./BookingSidebar";
import GuideCard from "./GuideCard";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedTour, loading, error } = useSelector((state) => state.tour);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    dispatch(fetchTourById(id));
  }, [dispatch, id]);

  const tour = selectedTour;

  if (loading)
    return <h2 className="text-center text-primary mt-5">Loading tour...</h2>;

  if (error || !tour)
    return <h2 className="text-center text-danger mt-5">Tour not found</h2>;

  const openModal = (img) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={`container py-4 ${styles.tourDetail}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={() => navigate("/tours")}
        >
          <img src={retrunArrow} alt="Back" width="20" height="20" />
          <span>Back to Tours</span>
        </button>

        <button
          className="btn btn-success"
          onClick={() => setShowBooking(true)}
        >
          Book Now
        </button>
      </div>

      <h1 className="mb-4 fw-bold text-primary">{tour.name}</h1>

      <img
        src={`https://toursapi-apoorv.onrender.com/img/tours/${tour.imageCover}`}
        alt={tour.name}
        className={`img-fluid rounded shadow-sm mb-4 ${styles.coverImage}`}
      />

      <p className="lead">{tour.summary}</p>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-secondary">Tour Details</h4>
              <ul className="list-unstyled">
                <li>
                  <strong>Duration:</strong> {tour.duration} days
                </li>
                <li>
                  <strong>Difficulty:</strong> {tour.difficulty}
                </li>
                <li>
                  <strong>Max Group Size:</strong> {tour.maxGroupSize} people
                </li>
                <li>
                  <strong>Price:</strong> ${tour.price}
                </li>
                <li>
                  <strong>Rating:</strong> {tour.ratingsAverage} ⭐ (
                  {tour.ratingsQuantity} reviews)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h4 className="card-title text-secondary">
              Start Dates & Availability
            </h4>
            <div className="row g-2">
              {tour.startDates.map((date, index) => (
                <div key={date} className="col-12">
                  <div className="d-flex justify-content-between align-items-center border rounded px-3 py-2 bg-light">
                    <span className="text-dark">
                      {new Date(date).toDateString()}
                    </span>
                    <span className="badge bg-success">
                      {tour.spotsLeftPerDate?.[index] ?? "N/A"} spots left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <h3 className="mt-4 mb-3 text-success">Gallery</h3>
      <div className="row g-3 mb-4">
        {tour.images.map((img, index) => (
          <div
            className="col-6 col-md-4 col-lg-3"
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => openModal(img)}
          >
            <img
              src={`https://toursapi-apoorv.onrender.com/img/tours/${img}`}
              alt={`Tour scene ${index + 1}`}
              className={`img-fluid rounded shadow-sm ${styles.galleryImage}`}
            />
          </div>
        ))}
      </div>

      {/* Guides Section */}
      {tour.guides?.length > 0 && (
        <>
          <h4 className="mt-5 text-warning">Meet the Guides</h4>
          <div className="row g-3 mb-4">
            {tour.guides.map((guide) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={guide._id}
              >
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* location map */}

      {/* <div className="tour-map-container">
        <TourMap locations={tour.locations} />
      </div> */}

      {/* Modal */}
      {selectedImage && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={closeModal}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body p-0">
                <img
                  src={`https://toursapi-apoorv.onrender.com/img/tours/${selectedImage}`}
                  alt="Expanded view"
                  className="img-fluid w-100 rounded"
                />
              </div>
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3 btn btn-light"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
          </div>
        </div>
      )}

      <h4 className="mt-4 text-info">Description</h4>
      <p className="mb-5">{tour.description}</p>

      <button className="btn btn-success" onClick={() => setShowBooking(true)}>
        Book Now
      </button>

      {showBooking && (
        <BookingSidebar tour={tour} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
};

export default TourDetail;
