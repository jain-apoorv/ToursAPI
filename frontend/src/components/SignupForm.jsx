import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    policy: false,
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confPassword) {
      return alert("Passwords do not match!");
    }

    if (!formData.policy) {
      return alert("You must agree to the Terms & Conditions.");
    }

    const resultAction = await dispatch(signupUser(formData));

    if (signupUser.fulfilled.match(resultAction)) {
      setSuccessMessage("Account created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confPassword: "",
        policy: false,
      });
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4 mx-auto">
        <form onSubmit={handleSubmit}>
          <div
            className="bg-primary p-4 rounded shadow"
            style={{ maxWidth: "500px", margin: "auto" }}
          >
            <h3 className="text-center text-white">Create Your Free Account</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}

            <div className="mb-3">
              <label htmlFor="name" className="form-label text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="email" className="form-label text-white">
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="confPassword" className="form-label text-white">
              Confirm Password
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                id="confPassword"
                name="confPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={formData.confPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-check text-center mb-3">
              <input
                type="checkbox"
                id="policy"
                name="policy"
                className="form-check-input"
                checked={formData.policy}
                onChange={handleChange}
              />
              <label htmlFor="policy" className="form-check-label text-white">
                I agree to the Terms & Conditions
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
