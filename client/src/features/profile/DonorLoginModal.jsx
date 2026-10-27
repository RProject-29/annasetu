import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { storageService } from '../../services/storageService';
import {
  HeartHandshake,
  User,
  Lock,
  Mail,
  Building,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  LogIn,
  UserPlus
} from 'lucide-react';

export const DonorLoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMessage = ''
}) => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('rohit.sharma@banquet.com');
  const [loginPassword, setLoginPassword] = useState('rohit123');

  // Register form state
  const [regData, setRegData] = useState({
    name: 'Rohit Sharma',
    org: 'Grand Celebrations Banquet Hall',
    phone: '+91 98765 43210',
    email: 'rohit.sharma@banquet.com',
    address: '80 Feet Road, Indiranagar, Bengaluru',
    landmark: 'Opposite BDA Complex Gate 1',
    password: 'rohit123',
    confirmPassword: 'rohit123'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = storageService.loginDonor(loginIdentifier, loginPassword);
      setLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess(res.donor);
        onClose();
      } else {
        setError(res.error || 'Invalid donor phone/email or password.');
      }
    }, 300);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.name.trim()) {
      setError('Please provide your full donor name.');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (regData.password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = storageService.registerDonor(regData);
      setLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess(res.donor);
        onClose();
      } else {
        setError(res.error || 'Unable to register donor.');
      }
    }, 400);
  };

  const handleQuickDemoFill = (ident, pass) => {
    setTab('login');
    setLoginIdentifier(ident);
    setLoginPassword(pass);
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === 'login' ? 'Food Donor (Annadata) Sign In' : 'New Food Donor Registration'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Header Icon & Message */}
        <div style={{ textAlign: 'center', padding: '2px 0' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-50)',
              color: 'var(--brand-600)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}
          >
            <HeartHandshake size={20} />
          </div>
          <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>
            {tab === 'login' ? 'Welcome Back, Annadata' : 'Join as a Surplus Food Donor'}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
            {initialMessage || 'Direct shelter rescue coordination with doorstep volunteer pickup.'}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}
        >
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: '11.5px',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: tab === 'login' ? '#ffffff' : 'transparent',
              color: tab === 'login' ? 'var(--brand-700)' : 'var(--text-secondary)',
              boxShadow: tab === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Sign In (Existing)
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: '11.5px',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: tab === 'register' ? '#ffffff' : 'transparent',
              color: tab === 'register' ? 'var(--brand-700)' : 'var(--text-secondary)',
              boxShadow: tab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            New Registration
          </button>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
              color: 'var(--status-danger-text)',
              fontSize: '11.5px'
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>
                Mobile Number, Email or Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or rohit"
                  style={{ paddingLeft: '30px', padding: '7px 8px 7px 30px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>
                Donor Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{ paddingLeft: '30px', padding: '7px 8px 7px 30px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Quick Demo Pre-fills */}
            <div style={{ marginTop: '2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                QUICK SIGN IN TEST ACCOUNTS:
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('rohit.sharma@banquet.com', 'rohit123')}
                  style={{
                    fontSize: '10.5px',
                    padding: '3px 8px',
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    color: '#92400E',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ⚡ Rohit Sharma (rohit123)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('priya.verma@kaveri.com', 'priya123')}
                  style={{
                    fontSize: '10.5px',
                    padding: '3px 8px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ⚡ Priya Verma (priya123)
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              block
              loading={loading}
              icon={LogIn}
              style={{ fontWeight: 800, marginTop: '4px', padding: '9px 12px' }}
            >
              Sign In as Annadata
            </Button>
          </form>
        ) : (
          /* TAB 2: NEW REGISTRATION */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '2px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={13} style={{ position: 'absolute', left: '9px', top: '9px', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  required
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="e.g. Rohit Sharma"
                  style={{ paddingLeft: '28px', padding: '6px 8px 6px 28px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '2px' }}>
                Banquet / Hotel / Caterer Name (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={13} style={{ position: 'absolute', left: '9px', top: '9px', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  value={regData.org}
                  onChange={(e) => setRegData({ ...regData, org: e.target.value })}
                  placeholder="e.g. Grand Celebrations Banquet Hall"
                  style={{ paddingLeft: '28px', padding: '6px 8px 6px 28px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, marginBottom: '2px' }}>
                  Mobile Phone *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-tertiary)' }} />
                  <input
                    type="tel"
                    required
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+91 98765..."
                    style={{ paddingLeft: '24px', padding: '6px 6px 6px 24px', fontSize: '11.5px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, marginBottom: '2px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-tertiary)' }} />
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="donor@email.com"
                    style={{ paddingLeft: '24px', padding: '6px 6px 6px 24px', fontSize: '11.5px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '2px' }}>
                Default Pickup Address & Landmark
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={13} style={{ position: 'absolute', left: '9px', top: '9px', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  value={regData.address}
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                  placeholder="Street address, Area, City"
                  style={{ paddingLeft: '28px', padding: '6px 8px 6px 28px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, marginBottom: '2px' }}>
                  Create Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-tertiary)' }} />
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Min 4 chars"
                    style={{ paddingLeft: '24px', padding: '6px 6px 6px 24px', fontSize: '11.5px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, marginBottom: '2px' }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-tertiary)' }} />
                  <input
                    type="password"
                    required
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    placeholder="Repeat"
                    style={{ paddingLeft: '24px', padding: '6px 6px 6px 24px', fontSize: '11.5px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              block
              loading={loading}
              icon={UserPlus}
              style={{ fontWeight: 800, marginTop: '4px', padding: '9px 12px' }}
            >
              Complete Registration & Sign In
            </Button>
          </form>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '3px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'center',
            background: 'none',
            border: 'none'
          }}
        >
          Continue as Guest for now
        </button>
      </div>
    </Modal>
  );
};
