import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../utils/auth';

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
    <div>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <button type="submit">Send password reset email</button>
      </form>
      <Link to="/login"><button>Login</button></Link>
    </div>
  );
};

export default ForgotPassword;
