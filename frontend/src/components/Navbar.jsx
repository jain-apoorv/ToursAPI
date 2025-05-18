import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAndReset, logoutUser } from "../store/slices/authSlice";
import logo from "../assets/yatraNavBar.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // dispatch(logoutUser());
    dispatch(logoutAndReset());
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-md navbar-light bg-light"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1020,
        minWidth: "300px",
      }}
    >
      <div
        className="container-fluid"
        style={{ maxWidth: "1200px", margin: "auto" }}
      >
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Yatra travel booking logo" height={70} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-wrap">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname.startsWith("/tours") ? "active" : ""
                }`}
                to="/tours"
              >
                Tours
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname.startsWith("/bookings") ? "active" : ""
                  }`}
                  to="/bookings"
                >
                  MyBookings
                </Link>
              </li>
            )}
          </ul>
          <div className="d-flex gap-2">
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
                <span className="navbar-text me-3">Welcome, {user?.name}</span>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
