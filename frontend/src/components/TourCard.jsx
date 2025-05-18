import { Link } from "react-router-dom";
const apiURL = import.meta.env.VITE_BACKEND_URL;

const TourCard = ({ tour }) => {
  return (
    <div className="col-md-4 col-sm-6 col-12 mb-4">
      <div className="card shadow-sm border-0 rounded">
        {/* Tour Image */}

        <img
          src={`https://toursapi-apoorv.onrender.com/img/tours/${tour.imageCover}`}
          className="card-img-top rounded-top"
          alt={tour.name}
          style={{ height: "200px", objectFit: "cover" }}
        />

        <div className="card-body text-center bg-white">
          {/* Tour Name */}
          <h5 className="card-title text-primary fw-bold">{tour.name}</h5>

          {/* Tour Summary */}
          <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
            {tour.summary}
          </p>

          {/* Tour Details */}
          <ul className="list-group list-group-flush text-start">
            <li className="list-group-item text-muted">
              <i className="fas fa-clock text-warning"></i> {tour.duration} days
            </li>
            <li className="list-group-item text-muted">
              <i className="fas fa-users text-success"></i> Max{" "}
              {tour.maxGroupSize} people
            </li>
            <li className="list-group-item text-muted">
              <i className="fas fa-star text-warning"></i> {tour.ratingsAverage}{" "}
              ({tour.ratingsQuantity} reviews)
            </li>
          </ul>

          {/* Tour Price & Button */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-dark fw-bold">${tour.price}</span>
            <Link
              to={`/tours/${tour._id}`}
              className="btn btn-primary btn-sm px-3"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
