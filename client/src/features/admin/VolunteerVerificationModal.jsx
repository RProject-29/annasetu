import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { VOLUNTEER_STATUS } from '../../constants/roles';
import {
  UserCheck,
  XCircle,
  FileText,
  MapPin,
  Bike,
  ShieldCheck,
  Phone,
  Mail
} from 'lucide-react';

export const VolunteerVerificationModal = ({
  isOpen,
  onClose,
  volunteer,
  onApprove,
  onReject
}) => {
  const [adminNotes, setAdminNotes] = useState('Identity verified against government database. Transport confirmed.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!volunteer) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onApprove(volunteer.id, adminNotes);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleReject = () => {
    onReject(volunteer.id, adminNotes || 'Document illegible or failed background criteria.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Volunteer Application"
      subtitle={`Application ID: ${volunteer.id} • ${volunteer.name}`}
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Profile Details */}
        <div className="as-card as-card-elevated" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{volunteer.name}</h3>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={12} /> {volunteer.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} /> {volunteer.email}
              </span>
            </div>
          </div>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              fontSize: '11px',
              fontWeight: 700,
              height: 'fit-content'
            }}
          >
            {volunteer.status}
          </span>
        </div>

        {/* ID Document Preview */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Submitted Government ID Document
          </span>
          <div className="as-card" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={volunteer.idDocumentPreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60'}
              alt="ID Document"
              style={{ width: '120px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-default)' }}
            />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{volunteer.idDocumentType || 'Aadhaar Card'}</h4>
              <p style={{ fontSize: '12px', color: 'var(--brand-500)', fontFamily: 'var(--font-family-mono)' }}>
                Doc #: {volunteer.idDocumentNumber || 'XXXX-XXXX-9482'}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Clear photograph and legible number present.
              </p>
            </div>
          </div>
        </div>

        {/* Transport & Coverage */}
        <div className="responsive-2col">
          <div className="as-card">
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Transport Mode</span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {volunteer.transportType}
            </p>
          </div>
          <div className="as-card">
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Service Radius & Areas</span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {volunteer.maximumDistanceKm} km • {Array.isArray(volunteer.serviceAreas) ? volunteer.serviceAreas.join(', ') : volunteer.serviceAreas}
            </p>
          </div>
        </div>

        {/* Verification Notes */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Admin Verification Notes
          </label>
          <input
            type="text"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          <Button
            variant="outline"
            icon={XCircle}
            onClick={handleReject}
            style={{ color: 'var(--status-danger-text)' }}
          >
            Reject Application
          </Button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="success"
              icon={UserCheck}
              loading={isSubmitting}
              onClick={handleApprove}
            >
              Verify & Activate Volunteer
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
