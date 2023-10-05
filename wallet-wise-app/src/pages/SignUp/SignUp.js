import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("student"); // Default role is student
  const [idNumber, setIdNumber] = useState(""); // Add idNumber state
  const [storeName, setStoreName] = useState(""); // New state for store name
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading effect

    try {
      // Determine whether to store ID number or store name based on the role
      const idOrStoreName = role === "vendor" ? storeName : idNumber;

      // Sign up the user and set their role or store name as part of the account creation
      await authService.signUp(
        email,
        password,
        fullName,
        idOrStoreName,
        phoneNumber,
        role
      );
      setIsSubmitting(false); // Stop loading effect
      navigate("/verify-email");
    } catch (err) {
      setIsSubmitting(false); // Stop loading effect on error
      setError(err.message);
    }
  };

  return (
    <div className="signup-parent">
      <div className="potato-box"></div>
      <div className="sign-form">
        <div className="signup-txtbox">
            <div className="signup-txtbox1">Welcome to</div>
            <div className="signup-txtbox2">WALLET</div>
            <div className="signup-txtbox3">WISE</div>
        </div>
        <div className="form-container">
          <form onSubmit={handleSignUp} className="signup-form">
            <div className="inputs">
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
            </div>
            <div className="signup-role">
              <label>
                Role:
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="vendor">Vendor</option>
                </select>
              </label>
            </div>
            <div className="signup-submit">
            {isSubmitting ? <><div className="success-message"><h3>"Signing up..." </h3></div></>: <button type="signup-submit">Sign up</button>}
            </div>
            <div className="error-message">{error && <p>{error}</p>}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
