import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../utils/auth";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      await authService.sendResetPasswordEmail(email);
      setEmailSent(true);
      setMessage("Password reset email has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Ensure to reset isSubmitting when done
    }
  };

  return (
    <div className="pass-body">
      <div className="pass-potato"></div>
      <div className="pass-smallbox">
        <div className="pass-wallet">WALLET</div>
        <div className="pass-wise">WISE</div>
        {emailSent ? (
          <>
            <p>{message}</p>
            <Link to="/login">
              <button type="login-btn-forgot">Login</button>
            </Link>
          </>
        ) : (
          <>
            <div className="pass-message">
              {isSubmitting
                ? "Sending email..."
                : "We will send a verification code to the email below"}
            </div>
            <form onSubmit={handleForgotPassword}>
              <input
                type="forgot-email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isSubmitting ? (
                <div className="forgot-message">
                  {message && <p>{message}</p>}
                </div>
              ) : (
                <button type="forgot-submit">Send password reset email</button>
              )}
            </form>
            <Link to="/login">
              <button type="login-btn-forgot">Login</button>
            </Link>
          </>
        )}
        <div className="forgot-error-message">{error && <div className="forgot-error-message"><p>{error}</p></div>}</div>
      </div>
    </div>
  );
};

export default ForgotPassword;
