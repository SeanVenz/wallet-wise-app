import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import "./LogIn.css";
import { Link } from 'react-router-dom';

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      await authService.logIn(email, password);
      const user = authService.getCurrentUser();
  
      if (!user.emailVerified) {
        setError("Please verify your email first.");
        authService.logOut();
      } else {
        // Retrieve the user's role from Firestore
        const role = await authService.getUserRoleFromFirestore(user.uid);

        role === "vendor" ? navigate("/vendor") : navigate("/student");; 
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-parent">
      <div className="main-box">
        <div className="text-box1">Welcome to</div>
        <div className="text-box2">WALLET</div>
        <div className="text-box3">WISE</div>
        <div classname="credentials-box"> 
          <form onSubmit={handleLogIn}>
            <input
              type="email"
              placeholder="Enter username or Email Adress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error-message">
            {error && <p>{error}</p>}
            </div>
            <button type="submit">LOGIN</button>
          </form>
        </div>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
      <div className="potato-box"></div>
    </div>
  );
};

export default LogIn;
