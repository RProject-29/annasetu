import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { storageService } from '../../services/storageService';
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const EditDonorProfileModal = ({
  isOpen,
  onClose,
  donorUser,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    org: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    currentPassword: '',
    newPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (donorUser) {
      setFormData({
        name: donorUser.name || '',
        org: donorUser.org || '',
        phone: donorUser.phone || '',
        email: donorUser.email || '',
        address: donorUser.address || '',
        landmark: donorUser.landmark || '',
        currentPassword: '',
        newPassword: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [donorUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Verify current password for security
    if (donorUser?.password && !storageService.verifyDonorPassword(formData.currentPassword)) {
      setError('Incorrect current password. Please enter the password you set during registration.');
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const updatePayload = {
        name: formData.name.trim(),
        org: formData.org.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        landmark: formData.landmark.trim()
      };

      if (formData.newPassword.trim()) {
        updatePayload.password = formData.newPassword.trim();
      }

      const res = storageService.updateDonorProfile(updatePayload);
      setSaving(false);

      if (res.success) {
        setSuccess(true);
        if (onSave) onSave(res.donor);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Failed to update profile.');
      }
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Food Donor (Annadata) Profile"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 2px', lineHeight: 1.35 }}>
          Update your organization details, mobile contact, and address. Enter your password to authenticate changes.
        </p>

        {success && (
          <div
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success-text)',
              border: '1px solid var(--status-success-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <CheckCircle2 size={16} />
            <span>Profile successfully updated!</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              border: '1px solid var(--status-danger-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px'
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '3px' }}>
            Full Donor Name *
          </label>
          <div style={{ position: 'relative' }}>
            <User size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ paddingLeft: '30px', padding: '7px 8px 7px 30px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Organization / Banquet */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '3px' }}>
            Banquet / Caterer / Business Name
          </label>
          <div style={{ position: 'relative' }}>
            <Building size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={formData.org}
              onChange={(e) => setFormData({ ...formData, org: e.target.value })}
              placeholder="e.g. Grand Celebrations Banquet Hall"
              style={{ paddingLeft: '30px', padding: '7px 8px 7px 30px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Phone & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>
              Mobile Phone *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={12} style={{ position: 'absolute', left: '9px', top: '10px', color: 'var(--text-tertiary)' }} />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ paddingLeft: '26px', padding: '7px 6px 7px 26px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={12} style={{ position: 'absolute', left: '9px', top: '10px', color: 'var(--text-tertiary)' }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ paddingLeft: '26px', padding: '7px 6px 7px 26px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '3px' }}>
            Default Pickup Address & Landmark
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 80 Feet Road, Indiranagar, Bengaluru"
              style={{ paddingLeft: '30px', padding: '7px 8px 7px 30px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Password Security Box */}
        <div
          style={{
            padding: '10px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: 'var(--brand-700)' }}>
            <ShieldCheck size={14} />
            <span>Password Security Verification</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, marginBottom: '2px' }}>
                Current Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-tertiary)' }} />
                <input
                  type="password"
                  required={Boolean(donorUser?.password)}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Enter current"
                  style={{ paddingLeft: '24px', padding: '6px 6px 6px 24px', fontSize: '11.5px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, marginBottom: '2px' }}>
                New Password (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-tertiary)' }} />
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Leave blank to keep"
                  style={{ paddingLeft: '24px', padding: '6px 6px 6px 24px', fontSize: '11.5px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <Button type="button" variant="secondary" size="md" block onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" block loading={saving} icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
