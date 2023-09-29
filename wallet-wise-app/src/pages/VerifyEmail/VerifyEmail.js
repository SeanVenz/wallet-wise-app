import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from "../../utils/auth";
import './Verify.scss'

const VerifyEmail = () => { 
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = authService.observeAuthChanges(user => {
      // If the user has verified their email, navigate to the login page
      if (user?.emailVerified) {
        navigate("/login");
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [navigate]);
 
  const resendEmail = async () => {
    const user = authService.getCurrentUser();
    if (user && !user.emailVerified) {
      await authService.sendVerificationEmail(user);
    }
  };

  return (
    <div id='verify'>
      <h2 className='verify-email'>Verify your Email</h2>
      <p>Please check your inbox and click the link provided to verify your email before logging in.</p>
      <button onClick={resendEmail}>Resend Verification Email</button>
    </div>
  );
};

export default VerifyEmail;
