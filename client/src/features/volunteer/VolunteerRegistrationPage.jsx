import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import {
  Bike,
  ShieldCheck,
  FileText,
  MapPin,
  CheckCircle2,
  Upload,
  AlertCircle,
  Clock,
  Navigation,
  User,
  Lock,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

const TRANSPORT_MODES = [
  { id: 'Two-Wheeler (with insulated crate)', label: 'Two-Wheeler (Motorcycle / Scooter)', desc: 'Ideal for small-to-medium batches (< 120 meals)' },
  { id: 'Four-Wheeler (Car)', label: 'Four-Wheeler (Car)', desc: 'Good for up to 250 meals' },
  { id: 'Utility Van / Cargo', label: 'Utility Van / Cargo', desc: 'Large batches (250+ meals)' },
  { id: 'On Foot / Bicycle', label: 'On Foot / Bicycle', desc: 'Very local neighborhood rescues (< 1.5 km)' }
];

const WORKING_TIME_OPTIONS = [
  'Morning (8:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 4:00 PM)',
  'Evening (4:00 PM – 8:00 PM)',
  'Night (8:00 PM – 11:30 PM)',
  'Flexible / Available On-Call'
];

const ROUTE_OPTIONS = [
  'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board',
  'Whitefield ➔ Marathahalli ➔ Bellandur Corridor',
  'Shivaji Nagar ➔ Frazer Town ➔ MG Road Corridor',
  'Jayanagar ➔ JP Nagar ➔ Banashankari Corridor',
  'Yeshwanthpur ➔ Malleshwaram ➔ Rajajinagar Corridor',
  'Custom Area Corridor'
];

const SAMPLE_ID_PREVIEWS = [
  { label: 'Sample Aadhaar Card', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60' },
  { label: 'Sample Driving License', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=60' },
  { label: 'Sample PAN Card', url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60' }
];

export const VolunteerRegistrationPage = ({
  onSubmitRegistration,
  onNavigateLogin,
  onBack
}) => {
  const [formData, setFormData] = useState({
    name: 'Priya Nair',
    phone: '+91 98234 56789',
    email: 'priya.nair@outlook.com',
    age: 24,
    gender: 'Female',
    username: 'priya_nair',
    password: 'password123',
    confirmPassword: 'password123',
    workingSuitableTime: 'Night (8:00 PM – 11:30 PM)',
    preferableRoute: 'Whitefield ➔ Marathahalli ➔ Bellandur Corridor',
    idDocumentType: 'Aadhaar Card',
    idDocumentNumber: '9842-1123-4567',
    idDocumentPreview: SAMPLE_ID_PREVIEWS[0].url,
    transportType: 'Two-Wheeler (with insulated crate)',
    maximumDistanceKm: 10,
    serviceAreas: ['Whitefield', 'Marathahalli', 'Bellandur'],
    agreedToTerms: true
  });

  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      return;
    }
    setPasswordError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (onSubmitRegistration) {
        onSubmitRegistration(formData);
      }
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-700)', fontSize: '11.5px', fontWeight: 800 }}>
          <Bike size={16} />
          <span>JOIN THE ANNASETU CORPS • ANNAPURNA SEVAK</span>
        </div>
        <h1 style={{ fontSize: '21px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Volunteer Registration
        </h1>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Become a registered food hero. Share your commute route so administrators can suggest surplus food pickups directly along your path.
        </p>

        {onNavigateLogin && (
          <div style={{ marginTop: '4px', fontSize: '12px' }}>
            <span>Already registered? </span>
            <button
              type="button"
              onClick={onNavigateLogin}
              style={{ color: 'var(--brand-700)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
            >
              Sign in with your username & password ➔
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Step 1: Personal Profile Details */}
        <div className="as-card">
          <h3 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} style={{ color: 'var(--brand-500)' }} />
            <span>1. Personal & Contact Information</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name as on ID card"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Age *
                </label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Account Credentials Creation */}
        <div className="as-card">
          <h3 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} style={{ color: 'var(--brand-500)' }} />
            <span>2. Create Account Login Credentials</span>
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Create your username and password. You will use these to log in and edit your profile whenever you log out.
          </p>

          {passwordError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                fontSize: '12px',
                marginBottom: '10px'
              }}
            >
              <AlertCircle size={14} />
              <span>{passwordError}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Choose Username *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. priya_nair"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Working Time & Preferable Route Corridor */}
        <div className="as-card">
          <h3 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: 'var(--brand-500)' }} />
            <span>3. Working Time & Commute Route</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Suitable Working Time / Slot *
              </label>
              <select
                value={formData.workingSuitableTime}
                onChange={(e) => setFormData({ ...formData, workingSuitableTime: e.target.value })}
              >
                {WORKING_TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', display: 'block' }}>
                Dispatch will match surplus food ready during this specific time window.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Preferable Travel / Commute Route *
              </label>
              <select
                value={formData.preferableRoute}
                onChange={(e) => setFormData({ ...formData, preferableRoute: e.target.value })}
              >
                {ROUTE_OPTIONS.map(route => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>

              <div
                style={{
                  marginTop: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--brand-50)',
                  border: '1px solid var(--brand-100)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <Navigation size={16} style={{ color: 'var(--brand-600)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '11.5px', color: 'var(--brand-700)', lineHeight: 1.4 }}>
                  <strong>Admin Intelligent Suggestion:</strong> By sharing your daily route corridor, the system can automatically suggest pickups right along your commute path with zero extra detour!
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                Primary Mode of Transport *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TRANSPORT_MODES.map(mode => (
                  <div
                    key={mode.id}
                    onClick={() => setFormData({ ...formData, transportType: mode.id })}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: formData.transportType === mode.id ? '2px solid var(--brand-500)' : '1px solid var(--border-default)',
                      backgroundColor: formData.transportType === mode.id ? 'var(--brand-50)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{mode.label}</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{mode.desc}</p>
                    </div>
                    {formData.transportType === mode.id && <CheckCircle2 size={16} style={{ color: 'var(--brand-600)' }} />}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Maximum Rescue Travel Radius:</label>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-600)' }}>
                  {formData.maximumDistanceKm} km
                </span>
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
          </div>
        </div>

        {/* Step 4: Government Identity Proof Verification */}
        <div className="as-card">
          <h3 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--brand-500)' }} />
            <span>4. Government Identity Proof Verification</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Select Identity Document Type *
              </label>
              <select
                value={formData.idDocumentType}
                onChange={(e) => setFormData({ ...formData, idDocumentType: e.target.value })}
              >
                <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                <option value="PAN Card">PAN Card (Income Tax Dept)</option>
                <option value="Driving License">Driving License (State RTO)</option>
                <option value="Voter ID">Voter ID (Election Commission)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Document Number *
              </label>
              <input
                type="text"
                required
                value={formData.idDocumentNumber}
                onChange={(e) => setFormData({ ...formData, idDocumentNumber: e.target.value })}
                placeholder="Enter ID number"
              />
            </div>

            {/* Document preview & sample picker */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Identity Proof Photo / Document Upload *
              </span>
              <div
                style={{
                  border: '1px dashed var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'var(--bg-surface-elevated)'
                }}
              >
                <img
                  src={formData.idDocumentPreview}
                  alt="ID Preview"
                  style={{ width: '56px', height: '42px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-default)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-success-solid)' }}>
                    ✓ Document Attached & Ready
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.3 }}>
                    Only verified AnnaSetu administrative officers can inspect this file.
                  </p>
                </div>
              </div>

              {/* Sample Photo selector */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {SAMPLE_ID_PREVIEWS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, idDocumentPreview: sample.url })}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: formData.idDocumentPreview === sample.url ? 'var(--brand-100)' : 'var(--bg-surface)',
                      border: formData.idDocumentPreview === sample.url ? '1px solid var(--brand-500)' : '1px solid var(--border-default)',
                      color: formData.idDocumentPreview === sample.url ? 'var(--brand-700)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    Use {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}
        >
          <input
            type="checkbox"
            id="vol-terms-check"
            checked={formData.agreedToTerms}
            onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
            style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--brand-500)' }}
          />
          <label htmlFor="vol-terms-check" style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            I pledge to uphold AnnaSetu's food safety standards, time-sensitive delivery deadlines, and respectful community distribution.
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={isSubmitting}
          disabled={!formData.agreedToTerms}
          icon={CheckCircle2}
        >
          Complete Registration & Join
        </Button>
      </form>
    </div>
  );
};
