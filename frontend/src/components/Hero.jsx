import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/yatraLogo.png";
import styles from "./Hero.module.css";

const Hero = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLoginClick = () => navigate("/login");
  const handleSignupClick = () => navigate("/signup");
  const handleExploreClick = () => navigate("/tours");

  return (
    <div className={`px-4 py-5 my-5 text-center ${styles.hero}`}>
      <img
        className="d-block mx-auto mb-4"
        src={logo}
        alt="Yatra Logo"
        width="200"
        height="150"
      />
      <h1 className="display-5 fw-bold">Discover Your Next Adventure</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          Explore the world with our curated tours. Choose your next adventure!
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          {isLoggedIn ? (
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 gap-3"
              onClick={handleExploreClick}
            >
              Explore Tours
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary btn-lg px-4 gap-3"
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg px-4"
                onClick={handleSignupClick}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
