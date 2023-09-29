import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../utils/auth';
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await authService.sendResetPasswordEmail(email);
      setMessage('Password reset email has been sent.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='pass-body'>
      <div className='pass-potato'></div>
      <div className='pass-smallbox'>
        <div className='pass-wallet'>WALLET</div>
        <div className='pass-wise'>WISE</div>
        <div className='pass-message'>We will send a verification code to the email below</div>
      <form onSubmit={handleForgotPassword}>
        <input
          type="forgot-email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* <div className='forgot-message'>{message && <p>{message}</p>}</div> */}
        <div className="forgot-error-message">{error && <p>{error}</p>}</div>
        <button type="forgot-submit">Send password reset email</button>
      </form>
      <Link to="/login"><button type='login-btn-forgot'>Login</button></Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
