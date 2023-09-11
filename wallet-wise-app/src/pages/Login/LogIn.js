import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../service/auth";
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
      } else if (authService.isAdmin(user)) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  );
};

export default LogIn;