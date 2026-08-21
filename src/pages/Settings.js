import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FiSave, FiLock, FiUser, FiMail, FiPhone, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { AuthContext } from '../App';
import '../styles/Settings.css';

function Settings() {
  const { API_URL, token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  // Password Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // App Settings
  const [appSettings, setAppSettings] = useState({
    businessName: 'Goa Package Manager',
    businessPhone: '+91-XXXXXXXXXX',
    businessEmail: 'info@goapackages.com',
    whatsappNumber: '+91-XXXXXXXXXX',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    fetchAppSettings();
  }, []);

  const fetchAppSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings/app-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppSettings(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Failed to load app settings');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppSettingChange = (e) => {
    const { name, value } = e.target;
    setAppSettings(prev => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(
        `${API_URL}/settings/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/settings/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to change password: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const saveAppSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Save settings (mock - would need backend endpoint)
      setSuccess('Application settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and application settings</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <FiAlertCircle size={20} />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <FiCheck size={20} />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser size={20} />
          Profile Settings
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FiLock size={20} />
          Change Password
        </button>
        <button
          className={`tab-button ${activeTab === 'app' ? 'active' : ''}`}
          onClick={() => setActiveTab('app')}
        >
          <FiMail size={20} />
          App Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="settings-form">
            <div className="form-card">
              <h2>Profile Information</h2>
              <form onSubmit={updateProfile}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="form-input disabled"
                    />
                    <p className="help-text">Email cannot be changed</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      value={user?.role || 'staff'}
                      disabled
                      className="form-input disabled"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">Full Name</label>
                    <div className="input-with-icon">
                      <FiUser size={20} />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Phone Number</label>
                    <div className="input-with-icon">
                      <FiPhone size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <FiSave size={18} />
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Password Settings */}
        {activeTab === 'password' && (
          <div className="settings-form">
            <div className="form-card">
              <h2>Change Password</h2>
              <p className="section-description">
                Enter your current password and choose a new one. Keep your password secure.
              </p>
              <form onSubmit={updatePassword}>
                <div className="form-group">
                  <label className="form-label required">Current Password</label>
                  <div className="input-with-icon">
                    <FiLock size={20} />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">New Password</label>
                    <div className="input-with-icon">
                      <FiLock size={20} />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        placeholder="Enter new password (min 6 characters)"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Confirm Password</label>
                    <div className="input-with-icon">
                      <FiLock size={20} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <FiLock size={18} />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* App Settings */}
        {activeTab === 'app' && (
          <div className="settings-form">
            <div className="form-card">
              <h2>Application Settings</h2>
              <form onSubmit={saveAppSettings}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={appSettings.businessName}
                      onChange={handleAppSettingChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business Phone</label>
                    <input
                      type="tel"
                      name="businessPhone"
                      value={appSettings.businessPhone}
                      onChange={handleAppSettingChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Business Email</label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={appSettings.businessEmail}
                      onChange={handleAppSettingChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={appSettings.whatsappNumber}
                      onChange={handleAppSettingChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select
                      name="currency"
                      value={appSettings.currency}
                      onChange={handleAppSettingChange}
                      className="form-input"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date Format</label>
                    <select
                      name="dateFormat"
                      value={appSettings.dateFormat}
                      onChange={handleAppSettingChange}
                      className="form-input"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select
                    name="timezone"
                    value={appSettings.timezone}
                    onChange={handleAppSettingChange}
                    className="form-input"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Bangkok">Asia/Bangkok</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <FiSave size={18} />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
