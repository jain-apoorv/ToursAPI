import { useState } from "react";

const GuideCard = function ({ guide }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(guide.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
  };

  return (
    <div className="d-flex align-items-center border rounded p-3 shadow-sm h-100">
      <img
        src={`http://127.0.0.1:3000/img/users/${guide.photo}`}
        alt={guide.name}
        className="rounded-circle me-3"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
        }}
      />
      <div className="d-flex flex-column">
        <h6 className="mb-1">{guide.name}</h6>
        <div className="d-flex align-items-center">
          <button
            onClick={handleCopy}
            className="btn btn-sm p-0 border-0 bg-transparent"
            title="Copy email"
            style={{ width: "auto", height: "auto" }}
          >
            <i className="bi bi-envelope fs-5 text-primary"></i>
          </button>
          {/* Blank space occupies space but doesn't shift layout */}
          <small
            className="text-success d-block ms-2"
            style={{
              visibility: copied ? "visible" : "hidden", // Visibility toggle
              opacity: copied ? 1 : 0, // Smoothly fade in/out
              height: "1.2rem", // Ensure fixed height so layout doesn't change
              lineHeight: "1.2rem", // Vertically center "Copied!" within space
              transition: "opacity 0.3s ease-in-out", // Fade effect
            }}
          >
            {copied ? "Copied!" : ""}
          </small>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
