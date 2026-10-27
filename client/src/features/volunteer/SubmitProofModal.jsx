import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { SAMPLE_FOOD_PHOTOS, SAMPLE_DISTRIBUTION_PROOFS } from '../../services/mockData';
import { PhotoCaptureInput } from '../../components/common/PhotoCaptureInput';
import { Camera, CheckCircle2, MapPin, Users, Utensils, Upload } from 'lucide-react';

export const SubmitProofModal = ({
  isOpen,
  onClose,
  donation,
  onSubmitProof
}) => {
  const [photo, setPhoto] = useState(SAMPLE_DISTRIBUTION_PROOFS?.[0] || SAMPLE_FOOD_PHOTOS[4]);
  const [peopleServed, setPeopleServed] = useState(donation?.quantityMeals ? Math.floor(donation.quantityMeals * 0.95) : 110);
  const [actualMealsDistributed, setActualMealsDistributed] = useState(donation?.quantityMeals || 120);
  const [notes, setNotes] = useState('Food was received hot and fresh. Clean meal service served directly to shelter residents and community elders.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const proofPayload = {
        distributionPhoto: photo,
        peopleServed: Number(peopleServed),
        actualMealsDistributed: Number(actualMealsDistributed),
        distributionTime: new Date().toISOString(),
        distributionLocationCheckpoint: `${donation?.destinationName || 'Designated Shelter'} (GPS 12.9856, 77.6054)`,
        notes
      };

      onSubmitProof(proofPayload);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Distribution Evidence"
      subtitle={`Rescue #${donation?.publicReference} • Final Checkpoint`}
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Please upload clear photographic evidence and confirm the number of people served at <strong>{donation?.destinationName || 'the assigned shelter'}</strong>.
        </p>

        {/* Distribution Photo Upload & Live Camera Capture */}
        <PhotoCaptureInput
          value={photo}
          onChange={(newPhoto) => setPhoto(newPhoto)}
          label="Distribution Photo Proof"
          subtitle="Take photo with camera or upload image of food delivered"
          checkpointText={`📍 Checkpoint: ${donation?.destinationName || 'Shelter'} (${new Date().toLocaleTimeString()})`}
          samplePhotos={SAMPLE_DISTRIBUTION_PROOFS || SAMPLE_FOOD_PHOTOS}
          required
        />

        {/* Quantities */}
        <div className="responsive-2col">
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              People Served *
            </label>
            <input
              type="number"
              required
              min="1"
              value={peopleServed}
              onChange={(e) => setPeopleServed(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Actual Meals Distributed *
            </label>
            <input
              type="number"
              required
              min="1"
              value={actualMealsDistributed}
              onChange={(e) => setActualMealsDistributed(e.target.value)}
            />
          </div>
        </div>

        {/* Location Checkpoint */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Distribution Checkpoint
          </label>
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MapPin size={14} style={{ color: 'var(--status-success-solid)' }} />
            <span>{donation?.destinationName || 'Pragati Shelter Kitchen (Ward 4)'}</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Volunteer Distribution Notes
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Condition of food, handling notes, recipient remarks..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            icon={CheckCircle2}
            loading={isSubmitting}
          >
            Submit for Admin Verification
          </Button>
        </div>
      </form>
    </Modal>
  );
};
