import { useState } from 'react';

function Signup({ onSwitch, onSignupSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is okay and content type is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: Invalid response format');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      if (!data.user) {
        throw new Error('Invalid response: User data missing');
      }

      onSignupSuccess(data.user);
    } catch (err) {
      if (err.name === 'SyntaxError') {
        setError('Server error: Invalid response format');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
      console.error('Signup error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full_name">Full Name:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone_number">Phone Number:</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={() => onSwitch('login')} className="link-button">
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;
