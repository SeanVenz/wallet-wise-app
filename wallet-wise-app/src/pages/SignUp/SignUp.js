import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import "./SignUp.scss";
import MapboxMap from "components/Mapbox/Mapbox";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("student"); // Default role is student
  const [idNumber, setIdNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const idOrStoreName = role === "vendor" ? storeName : idNumber;

      const roleSpecificData = role === "vendor" ? { latitude, longitude } : {};

      role === "vendor"
        ? await authService.signUpVendor(
            email,
            password,
            fullName,
            idOrStoreName,
            phoneNumber,
            role,
            roleSpecificData.latitude,
            roleSpecificData.longitude
          )
        : await authService.signUp(
            email,
            password,
            fullName,
            idOrStoreName,
            phoneNumber,
            role
          );

      setIsSubmitting(false);
      navigate("/verify-email");
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message);
    }
  };

  const handleMapClose = (e) => {
    e.stopPropagation(); // Prevent click event propagation
    setShowMap(false); // Close the map
  };

  return (
    <div className="signup-parent">
      <form onSubmit={handleSignUp} className="signup-form">
        <div className="signup-txtbox">
          <div className="signup-txtbox1">Welcome to</div>
          <div className="signup-txtbox2">WALLET</div>
          <div className="signup-txtbox3">WISE</div>
        </div>
        <input
          className="signup-text"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {role === "student" ? (
          <input
            className="signup-text"
            type="text"
            placeholder="ID Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
        ) : (
          <input
            className="signup-text"
            type="text"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        )}
        <input
          className="signup-text"
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          className="signup-text"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="signup-text"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="vendor">Vendor</option>
            </select>
          </label>
        </div>
        <div className="signup-submit"></div>
        {isSubmitting ? (
          <div className="success-message">
            <h3>"Signing up..." </h3>
          </div>
        ) : (
          <button
            style={{ top: "0px", padding: "15px 32px", zIndex: "4" }}
            type="signup-submit"
          >
            Sign up
          </button>
        )}
        <div className="error-message">{error && <p>{error}</p>}</div>
      </form>
      <div className="signup-map">
        {role === "vendor" && (
          <div>
            {/* Toggle the map visibility */}
            <button
              className="open-map"
              onClickCapture={() => setShowMap(!showMap)}
            >
              {showMap ? "Close Map" : "Open Map"}
            </button>
            {/* Show the MapboxMap component when showMap is true */}
            {showMap && (
              <MapboxMap
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                onClose={(e) => {
                  handleMapClose(e);
                }}
              />
            )}
          </div>
        )}
      </div>
      <div className="potato-box"></div>
    </div>
  );
};

export default SignUp;
