import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { storageService } from '../../services/storageService';
import {
  LogIn,
  User,
  Lock,
  AlertCircle,
  CheckCircle2,
  Bike,
  UserCheck
} from 'lucide-react';

export const VolunteerLoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onNavigateRegister
}) => {
  const [username, setUsername] = useState('aarav');
  const [password, setPassword] = useState('aarav123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = storageService.loginVolunteer(username, password);
      setLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess(res.volunteer);
        onClose();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 400);
  };

  const handleQuickDemoFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Volunteer Sign In">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-50)',
              color: 'var(--brand-600)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px'
            }}
          >
            <Bike size={24} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Welcome Back, Rescuer</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Enter your volunteer credentials to manage rescues and edit your profile.
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
              color: 'var(--status-danger-text)',
              fontSize: '12px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px' }}>
              Username or Registered Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. aarav or priya"
                style={{ paddingLeft: '36px' }}
              />
              <User
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{ paddingLeft: '36px' }}
              />
              <Lock
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" block loading={loading} icon={LogIn}>
            Sign In to Profile
          </Button>
        </form>

        {/* Quick Demo Selector for seamless pairing */}
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px dashed var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--brand-600)', marginBottom: '8px' }}>
            <UserCheck size={14} />
            <span>Quick Test Volunteer Accounts:</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('aarav', 'aarav123')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                fontSize: '11.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span><strong>Aarav Patel</strong> (Verified, 18 rescues)</span>
              <span style={{ color: 'var(--brand-600)', fontWeight: 600 }}>aarav / aarav123</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('priya', 'priya123')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                fontSize: '11.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span><strong>Priya Nair</strong> (Pending KYC)</span>
              <span style={{ color: 'var(--brand-600)', fontWeight: 600 }}>priya / priya123</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            Are you a new volunteer?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigateRegister) onNavigateRegister();
              }}
              style={{ color: 'var(--brand-600)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
            >
              Register Here
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};
