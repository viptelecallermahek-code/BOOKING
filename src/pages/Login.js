import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../App';
import '../styles/Login.css';

function Login({ onLogin }) {
  const { API_URL } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      onLogin(response.data.token, response.data.user);
      setSuccess('Login successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone
      });

      onLogin(response.data.token, response.data.user);
      setSuccess('Registration successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">📦</div>
          <h1>Goa Package Manager</h1>
          <p>Professional Package Data Entry & Management Software</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="login-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <FiMail size={20} />
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon password-input">
              <FiLock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              className="toggle-form"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="login-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: demo@goapackages.com</p>
          <p>Password: demo123456</p>
          <p><em>Or create a new account to get started</em></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
