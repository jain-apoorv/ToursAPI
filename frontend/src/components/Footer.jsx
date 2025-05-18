import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-gradient text-white py-4 mt-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Section: Copyright */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Apoorv Jain
            </p>
          </div>
          {/* Center Section: Social Links */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <a
              href="https://www.linkedin.com/in/apoorv-jain-9b9a60229/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link linkedin text-decoration-none me-3"
            >
              <FaLinkedin className="me-1" />
              LinkedIn
            </a>
            <a
              href="mailto:vardhamanapoorva@gmail.com"
              className="footer-link gmail text-decoration-none"
            >
              <FaEnvelope className="me-1" />
              Email
            </a>
          </div>
          {/* Right Section: Technology Note */}
          <div className="col-md-4 text-center text-md-end">
            <p className="mb-0">
              Built with{" "}
              <span role="img" aria-label="love">
                ❤️
              </span>{" "}
              using React and Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
