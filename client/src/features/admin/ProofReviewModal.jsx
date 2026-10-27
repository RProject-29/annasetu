import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  MapPin,
  Clock,
  Users,
  Utensils,
  Flag
} from 'lucide-react';

export const ProofReviewModal = ({
  isOpen,
  onClose,
  donation,
  onCompleteRescue,
  onRequestClarification
}) => {
  const [checklist, setChecklist] = useState({
    photoVerified: true,
    quantityVerified: true,
    peopleServedVerified: true,
    locationVerified: true,
    timelineVerified: true
  });

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!donation) return null;

  const proof = donation.proofDetails || {};
  const allChecked = Object.values(checklist).every(Boolean);

  const handleComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onCompleteRescue(donation.id, notes || 'Admin inspected distribution photos, headcount, and verified destination hand-off.');
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const handleClarification = () => {
    if (!notes.trim()) {
      alert('Please provide a note specifying what clarification is required from the volunteer.');
      return;
    }
    onRequestClarification(donation.id, notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Distribution Proof Verification & Closure"
      subtitle={`Rescue #${donation.publicReference} • Volunteer: ${donation.assignedVolunteerName || 'Assigned Volunteer'}`}
      maxWidth="780px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Side-by-Side Photo Comparison */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Evidence Comparison
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: donation.pickupPhoto ? 'repeat(auto-fit, minmax(180px, 1fr))' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {/* Donor Photo */}
            <div className="as-card" style={{ padding: '8px' }}>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img
                  src={donation.foodPhoto}
                  alt="Food at pickup"
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.7)', fontSize: '10px', color: '#fff' }}>
                  1. Reported by Donor
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {donation.donorName} ({donation.quantityMeals} Meals)
              </p>
            </div>

            {/* Volunteer Pickup Photo if available */}
            {donation.pickupPhoto && (
              <div className="as-card" style={{ padding: '8px', border: '1px solid #38bdf8' }}>
                <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img
                    src={donation.pickupPhoto}
                    alt="Food collected at pickup"
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(56, 189, 248, 0.85)', fontSize: '10px', color: '#0b1120', fontWeight: 700 }}>
                    2. Collected at Pickup
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  By: {donation.assignedVolunteerName || 'Volunteer'}
                </p>
              </div>
            )}

            {/* Volunteer Distribution Photo */}
            <div className="as-card" style={{ padding: '8px', border: '1px solid var(--status-success-border)' }}>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img
                  src={proof.distributionPhoto || donation.foodPhoto}
                  alt="Food distributed"
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.85)', fontSize: '10px', color: '#fff', fontWeight: 700 }}>
                  {donation.pickupPhoto ? '3.' : '2.'} Delivered at Shelter
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {proof.peopleServed || donation.quantityMeals} People Served
              </p>
            </div>
          </div>
        </div>

        {/* Operational Facts Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>Reported Meals:</span>
            <strong style={{ fontSize: '14px', color: 'var(--brand-500)' }}>{donation.quantityMeals} Meals</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>People Served:</span>
            <strong style={{ fontSize: '14px', color: 'var(--status-success-text)' }}>{proof.peopleServed || 115} People</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>Destination Target:</span>
            <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{donation.destinationName || 'Pragati Shelter'}</strong>
          </div>
        </div>

        {/* Volunteer Notes */}
        {proof.notes && (
          <div className="as-card" style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong>Volunteer Note:</strong> "{proof.notes}"
          </div>
        )}

        {/* Verification Checklist */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
            Administrative Verification Checklist:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checklist.photoVerified}
                onChange={(e) => setChecklist({ ...checklist, photoVerified: e.target.checked })}
                style={{ accentColor: 'var(--status-success-solid)' }}
              />
              <span>Distribution photo legible & verified</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checklist.quantityVerified}
                onChange={(e) => setChecklist({ ...checklist, quantityVerified: e.target.checked })}
                style={{ accentColor: 'var(--status-success-solid)' }}
              />
              <span>Meals accounted for completely</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checklist.peopleServedVerified}
                onChange={(e) => setChecklist({ ...checklist, peopleServedVerified: e.target.checked })}
                style={{ accentColor: 'var(--status-success-solid)' }}
              />
              <span>Beneficiary count recorded</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checklist.locationVerified}
                onChange={(e) => setChecklist({ ...checklist, locationVerified: e.target.checked })}
                style={{ accentColor: 'var(--status-success-solid)' }}
              />
              <span>Location matches assigned shelter</span>
            </label>
          </div>
        </div>

        {/* Admin Review Note */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Administrative Decision Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Distribution photos satisfactory. Closed successfully."
          />
        </div>

        {/* Decision Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          <Button
            variant="outline"
            icon={Flag}
            onClick={handleClarification}
            style={{ color: 'var(--status-urgent-text)' }}
          >
            Request Clarification
          </Button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="success"
              icon={CheckCircle2}
              disabled={!allChecked}
              loading={isSubmitting}
              onClick={handleComplete}
            >
              Approve & Complete Rescue (Close)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
