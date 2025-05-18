import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (token && user) {
      navigate("/tours");
    }
  }, [token, user, navigate]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4 mx-auto">
        <form onSubmit={handleSubmit}>
          <div
            className="bg-primary p-4 rounded shadow"
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <h3 className="text-center text-white">Please Login to access</h3>

            {/* Error Message */}
            {error && <p className="text-center text-danger">{error}</p>}

            {/* Email Input */}
            <label htmlFor="email" className="form-label text-white mt-3">
              Email
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <label htmlFor="password" className="form-label text-white">
              Password
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-end">
              <a href="#" className="text-white">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <div className="text-center mt-3">
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-white mt-3">
              Don't have an account?{" "}
              <Link to="/signup" className="text-light">
                <strong>Sign Up</strong>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
