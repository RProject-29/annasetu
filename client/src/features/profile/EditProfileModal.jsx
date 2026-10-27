import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  User,
  Phone,
  Mail,
  Clock,
  Navigation,
  Bike,
  Save,
  CheckCircle2
} from 'lucide-react';

const WORKING_TIMES = [
  'Morning (8:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 4:00 PM)',
  'Evening (4:00 PM – 8:00 PM)',
  'Night (8:00 PM – 11:30 PM)',
  'Flexible / On-Call 24x7'
];

const PREFERABLE_ROUTES = [
  'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board',
  'Whitefield ➔ Marathahalli ➔ Bellandur Corridor',
  'Shivaji Nagar ➔ Frazer Town ➔ MG Road Corridor',
  'Jayanagar ➔ JP Nagar ➔ Banashankari Corridor',
  'Yeshwanthpur ➔ Malleshwaram ➔ Rajajinagar Corridor',
  'Custom Area Route'
];

export const EditProfileModal = ({
  isOpen,
  onClose,
  volunteer,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: volunteer?.name || '',
    phone: volunteer?.phone || '',
    email: volunteer?.email || '',
    age: volunteer?.age || 25,
    gender: volunteer?.gender || 'Prefer not to say',
    workingSuitableTime: volunteer?.workingSuitableTime || WORKING_TIMES[2],
    preferableRoute: volunteer?.preferableRoute || PREFERABLE_ROUTES[0],
    transportType: volunteer?.transportType || 'Two-Wheeler (with insulated crate)',
    maximumDistanceKm: volunteer?.maximumDistanceKm || 10
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Volunteer Profile">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {savedSuccess && (
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success-text)',
              border: '1px solid var(--status-success-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <CheckCircle2 size={16} />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              Mobile Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Suitable Working Time */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
            Suitable Working Hours
          </label>
          <select
            value={formData.workingSuitableTime}
            onChange={(e) => setFormData({ ...formData, workingSuitableTime: e.target.value })}
          >
            {WORKING_TIMES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', display: 'block' }}>
            Alerts will be prioritized when food is ready during this window.
          </span>
        </div>

        {/* Preferable Route Corridor */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
            Preferable Travel / Delivery Route
          </label>
          <select
            value={formData.preferableRoute}
            onChange={(e) => setFormData({ ...formData, preferableRoute: e.target.value })}
          >
            {PREFERABLE_ROUTES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <span style={{ fontSize: '11px', color: 'var(--brand-700)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
            ✓ Admin uses your route corridor to suggest pickup and drop points directly along your commute.
          </span>
        </div>

        {/* Service Radius Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
            <span>Maximum Rescue Distance Radius</span>
            <span style={{ color: 'var(--brand-600)' }}>{formData.maximumDistanceKm} km</span>
          </div>
          <input
            type="range"
            min="3"
            max="30"
            step="1"
            value={formData.maximumDistanceKm}
            onChange={(e) => setFormData({ ...formData, maximumDistanceKm: Number(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--brand-500)' }}
          />
        </div>

        {/* Password Update */}
        <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>
            Volunteer Login Password (Leave blank to keep unchanged)
          </label>
          <input
            type="password"
            value={formData.newPassword || ''}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value, password: e.target.value ? e.target.value : (volunteer?.password || 'aarav123') })}
            placeholder="Enter new password"
            style={{ fontSize: '12px', padding: '6px 8px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <Button type="button" variant="secondary" block onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" block icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
