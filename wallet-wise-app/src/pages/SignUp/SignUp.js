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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
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

      navigate("/verify-email");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-parent">
        <form onSubmit={handleSignUp} className="signup-form">
          <div className="text-box">
            <div className="text-box1">Welcome to</div>
            <div className="text-box2">WALLET</div>
            <div className="text-box3">WISE</div>
            </div>
          <input
            type="signup-text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {role === "student" ? (
            <input
              type="signup-text"
              placeholder="ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          ) : (
            <input
              type="signup-text"
              placeholder="Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          )}
          <input
            type="signup-text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="signup-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="signup-password"
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
          <div className="error-message">
            {error && <p>{error}</p>}
            </div>
          <button type="signup-submit">Sign up</button>
        </form>
        <div className="potato-box"></div>
      </div>
  );
};

export default SignUp;
