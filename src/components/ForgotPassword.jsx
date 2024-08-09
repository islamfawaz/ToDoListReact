import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', { email });
      setMessage('Password reset instructions have been sent to your email.');
    } catch (error) {
      setError('Failed to send password reset instructions. Please check the email address and try again.');
      console.error('Password reset request failed:', error);
    }
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit">Send Reset Instructions</button>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default ForgotPassword;
