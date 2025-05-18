import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TourCard from "./TourCard";
import styles from "./TourAlbum.module.css";
import { fetchTours } from "../store/slices/tourSlice";

const ToursAlbum = () => {
  const dispatch = useDispatch();
  const { tours, loading, error } = useSelector((state) => state.tour);
  const [filters, setFilters] = useState({
    difficulty: "",
    priceMin: 0,
    priceMax: Infinity,
    daysMin: 0,
    daysMax: Infinity,
    name: "",
    startDate: "",
    maxGroupSize: 0,
  });

  useEffect(() => {
    dispatch(fetchTours());
  }, [dispatch]);

  const filteredTours = tours.filter((tour) => {
    return (
      (filters.difficulty ? tour.difficulty === filters.difficulty : true) &&
      tour.price >= filters.priceMin &&
      tour.price <= filters.priceMax &&
      tour.duration >= filters.daysMin &&
      tour.duration <= filters.daysMax &&
      (filters.name
        ? tour.name.toLowerCase().includes(filters.name.toLowerCase())
        : true) &&
      (filters.startDate
        ? new Date(tour.startDates[0]) >= new Date(filters.startDate)
        : true) &&
      (filters.maxGroupSize ? tour.maxGroupSize <= filters.maxGroupSize : true)
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]:
        name.endsWith("Max") || name.endsWith("Min")
          ? value === ""
            ? name.endsWith("Max")
              ? Infinity
              : 0
            : Number(value)
          : value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      difficulty: "",
      priceMin: 0,
      priceMax: Infinity,
      daysMin: 0,
      daysMax: Infinity,
      name: "",
      startDate: "",
      maxGroupSize: 0,
    });
  };

  return (
    <div
      className="album bg-light"
      style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}
    >
      <div className="container" style={{ height: "100%" }}>
        <div className="row" style={{ height: "100%" }}>
          <div
            className={`col-md-3 bg-white p-3 rounded shadow-sm ${styles.sidebar}`}
          >
            <h5>Filters</h5>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search by name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <select
              className="form-select mb-2"
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <label className="form-label">Price Range</label>
            <div className="d-flex mb-2">
              <input
                type="number"
                className="form-control me-2"
                placeholder="Min"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                name="priceMax"
                value={filters.priceMax === Infinity ? "" : filters.priceMax}
                onChange={handleFilterChange}
              />
            </div>
            <label className="form-label">Duration(days)</label>
            <div className="d-flex mb-2">
              <input
                type="number"
                className="form-control me-2"
                placeholder="Min"
                name="daysMin"
                value={filters.daysMin}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                name="daysMax"
                value={filters.daysMax === Infinity ? "" : filters.daysMax}
                onChange={handleFilterChange}
              />
            </div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control mb-2"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <label className="form-label">Max Group Size</label>
            <input
              type="number"
              className="form-control mb-3"
              name="maxGroupSize"
              value={filters.maxGroupSize}
              onChange={handleFilterChange}
            />
            {/* ... */}
            <button
              className="btn btn-secondary w-100"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
          <div
            className="col-md-9"
            style={{ height: "100%", position: "relative" }}
          >
            <h2
              className="mb-4"
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f9f9f9",
                zIndex: 10,
                paddingTop: "0.5rem",
              }}
            >
              Explore Our Tours
            </h2>
            <div style={{ height: "calc(100% - 3rem)", overflowY: "auto" }}>
              <div className="row">
                {loading ? (
                  <div className="col-12 text-center">Loading tours...</div>
                ) : error ? (
                  <div className="col-12 text-center text-danger">{error}</div>
                ) : filteredTours.length > 0 ? (
                  filteredTours.map((tour) => (
                    <TourCard key={tour._id} tour={tour} />
                  ))
                ) : (
                  <div className="col-12 text-center">No tours available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursAlbum;
