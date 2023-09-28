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
        <div className='pass-message'>We've sent a verification code to your  email</div>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <button type="submit" className='pass-btn'>Send password reset email</button>
      </form>
      <Link to="/login"><button className='pass-btn'>Login</button></Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
