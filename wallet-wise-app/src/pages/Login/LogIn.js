import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import "./LogIn.css";
import { Link } from "react-router-dom";

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

        role === "vendor" ? navigate("/vendor") : navigate("/student");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-parent">
      <div className="main-box">
        <form onSubmit={handleLogIn} className="login-form">
          <div className="text-box1">Welcome to</div>
          <div className="text-box2">WALLET</div>
          <div className="text-box3">WISE</div>
          <input
            type="login-email"
            placeholder="Enter Username or Email Adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="login-password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-error-message">{error && <p>{error}</p>}</div>
          <button type="login-submit">LOGIN</button>
          <Link to="/forgot-password" className="login-forgot-password">
            Forgot password?
          </Link>
        </form>
      </div>
      <div className="login-potato-box"></div>
    </div>
  );
};

export default LogIn;
