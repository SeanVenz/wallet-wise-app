import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import "./Verify.scss";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Added emailSent state
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.observeAuthChanges((user) => {
      // If the user has verified their email, navigate to the login page
      if (user?.emailVerified) {
        navigate("/login");
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [navigate]);

  const resendEmail = async () => {
    try {
      setIsSubmitting(true);
      setError(null); // Clear any previous errors
      const user = authService.getCurrentUser();
      if (user && !user.emailVerified) {
        await authService.sendVerificationEmail(user);
        setIsSubmitting(false);
        setEmailSent(true); // Set emailSent to true
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsSubmitting(false); // Ensure that isSubmitting is set to false in case of an error
    }
  };

  return (
    <div id="verify" className="verify-parent">
      <div className="verify-right">
        <div className="verify-words">
          <div className="verify-wallet">WALLET</div>
          <div className="verify-wise">WISE</div>
        </div>
        <div className="message">
          {emailSent ? (
            <p>Verification email sent</p>
          ) : (
            <p>We've sent a verification code to your email</p>
          )}
        </div>
        <div className="button">
          {isSubmitting ? (
            <div className="submitting-message">
              <h3>Sending Verification Email...</h3>
            </div>
          ) : emailSent ? (
            // Display "Verification email sent" message
            <div className="success-message-verify">
              {/* <p>Verification email sent</p> */}
            </div>
          ) : (
            // Display the button to resend the email
            <button className="verify-message" onClick={resendEmail}>
              Resend Verification Email
            </button>
          )}
        </div>
        <div className="error-message-verify">{error && <p>{error}</p>}</div>
      </div>
      <div className="potato-box"></div>
    </div>
  );
};

export default VerifyEmail;
