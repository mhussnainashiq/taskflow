import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User, Shield, Trash2, LogOut, Info, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const Settings = () => {
  const { openSidebar } = useOutletContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ---------- Profile ----------
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const current = JSON.parse(localStorage.getItem('taskflow_user') || '{}');
    const updated = { ...current, name: name.trim() };
    localStorage.setItem('taskflow_user', JSON.stringify(updated));

    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
    const idx = users.findIndex((u) => u._id === current._id);
    if (idx !== -1) {
      users[idx].name = name.trim();
      localStorage.setItem('taskflow_users', JSON.stringify(users));
    }

    setProfileSuccess(true);
    setProfileMsg('Profile updated successfully');
    setTimeout(() => {
      setProfileMsg('');
      window.location.reload();
    }, 1200);
  };

  // ---------- Change Password ----------
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg('New password and confirm password do not match');
      return;
    }

    const current = JSON.parse(localStorage.getItem('taskflow_user') || '{}');
    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
    const idx = users.findIndex((u) => u._id === current._id);

    if (idx === -1) {
      setPasswordMsg('User not found');
      return;
    }

    // Check current password
    if (users[idx].password !== currentPassword) {
      setPasswordMsg('Current password is incorrect');
      return;
    }

    // Update password
    users[idx].password = newPassword;
    localStorage.setItem('taskflow_users', JSON.stringify(users));

    setPasswordSuccess(true);
    setPasswordMsg('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => setPasswordMsg(''), 2500);
  };

  // ---------- Reset Data ----------
  const handleResetData = () => {
    if (
      !window.confirm(
        'This will clear all projects, tasks, and activity and restore the demo data. Continue?'
      )
    )
      return;

    localStorage.removeItem('taskflow_seeded');
    localStorage.removeItem('taskflow_projects');
    localStorage.removeItem('taskflow_tasks');
    localStorage.removeItem('taskflow_activities');
    localStorage.removeItem('taskflow_users');
    localStorage.removeItem('taskflow_user');

    setTimeout(() => {
      logout();
      navigate('/');
      window.location.reload();
    }, 500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Header title="Settings" onMenuClick={openSidebar} />
      <div className="page-content">
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ===== Profile ===== */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Profile</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="user-avatar" style={{ width: 56, height: 56, fontSize: '1.25rem' }}>
                {getInitials(user?.name)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.0625rem' }}>{user?.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.email}</div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user?.email || ''} disabled />
              </div>

              {profileMsg && (
                <div style={{
                  background: profileSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: profileSuccess ? '#86EFAC' : '#FCA5A5',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                }}>
                  {profileMsg}
                </div>
              )}

              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>

          {/* ===== Change Password ===== */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Change Password</h3>
            </div>

            <form onSubmit={handleChangePassword}>
              {/* Current Password */}
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    className="form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {passwordMsg && (
                <div style={{
                  background: passwordSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: passwordSuccess ? '#86EFAC' : '#FCA5A5',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                }}>
                  {passwordMsg}
                </div>
              )}

              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>

          {/* ===== Account ===== */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Account</h3>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* ===== Data ===== */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color="var(--danger)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Data</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Reset will clear all projects, tasks, and activity and restore the original demo data.
            </p>
            <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleResetData}>
              <RefreshCw size={16} /> Reset to Demo Data
            </button>
          </div>

          {/* ===== About ===== */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={18} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>About</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>TaskFlow</strong> — Manage Your Projects
              <br />
              Version 1.0.0 · LocalStorage mode
              <br />
              Built with React + Vite
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;