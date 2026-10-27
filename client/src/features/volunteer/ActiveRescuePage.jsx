import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { StatusChip } from '../../components/common/StatusChip';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { Modal } from '../../components/common/Modal';
import { SubmitProofModal } from './SubmitProofModal';
import { PhotoCaptureInput } from '../../components/common/PhotoCaptureInput';
import { SAMPLE_FOOD_PHOTOS } from '../../services/mockData';
import { DONATION_STATUS } from '../../constants/donationStatus';
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Building,
  Utensils,
  Camera,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const ActiveRescuePage = ({
  rescue,
  onUpdateStatus,
  onBack
}) => {
  const [isPickupConfirmOpen, setIsPickupConfirmOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [pickupPhoto, setPickupPhoto] = useState(rescue?.pickupPhoto || rescue?.foodPhoto || SAMPLE_FOOD_PHOTOS[0]);

  if (!rescue) {
    return (
      <div className="as-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <Navigation size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>No Active Rescue</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          You have no active accepted rescues at this moment.
        </p>
      </div>
    );
  }

  // Determine current step index based on donation status
  // 1: ACCEPTED -> Next action: "Arrived at Pickup"
  // 2: VOLUNTEER_AT_PICKUP -> Next action: "Confirm Picked Up"
  // 3: PICKED_UP / DISTRIBUTION_IN_PROGRESS -> Next action: "Submit Distribution Proof"
  // 4: PROOF_SUBMITTED -> Waiting for Admin verification!
  let currentStepIndex = 1;
  if (rescue.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP) {
    currentStepIndex = 2;
  } else if (rescue.status === DONATION_STATUS.PICKED_UP || rescue.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS) {
    currentStepIndex = 3;
  } else if (rescue.status === DONATION_STATUS.PROOF_SUBMITTED) {
    currentStepIndex = 4;
  }

  const handleArrivedAtPickup = () => {
    onUpdateStatus(rescue.id, DONATION_STATUS.VOLUNTEER_AT_PICKUP, {
      statusNote: 'Volunteer recorded arrival checkpoint at donor premises.'
    });
  };

  const handleConfirmPickup = () => {
    onUpdateStatus(rescue.id, DONATION_STATUS.PICKED_UP, {
      pickupPhoto: pickupPhoto,
      pickedUpAt: new Date().toISOString(),
      statusNote: 'Food confirmed collected from donor with photo verification. In transit to destination.'
    });
    setIsPickupConfirmOpen(false);
  };

  const handleProofSubmitted = (proofData) => {
    onUpdateStatus(rescue.id, DONATION_STATUS.PROOF_SUBMITTED, {
      proofDetails: proofData,
      statusNote: `Distribution proof submitted for ${proofData.peopleServed} people. Awaiting admin verification.`
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success-text)', textTransform: 'uppercase' }}>
            Active Rescue #{rescue.publicReference}
          </span>
          <h1 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
            {rescue.foodDescription}
          </h1>
        </div>
        <StatusChip status={rescue.status} />
      </div>

      {/* Urgency Countdown Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <CountdownTimer targetTime={rescue.safeConsumptionDeadline} />
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-500)' }}>
          {rescue.quantityMeals} Meals
        </span>
      </div>

      {/* Multi-Step Checkpoint Stepper */}
      <div className="stepper-container">
        {/* Step 1: Accepted & Travel to Pickup */}
        <div className={`step-card ${currentStepIndex === 1 ? 'active' : 'completed'}`}>
          <div className="step-icon-wrap">
            {currentStepIndex > 1 ? <CheckCircle2 size={18} /> : 1}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>1. Travel to Pickup Location</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {rescue.pickupAddress}
            </p>
            {rescue.pickupLandmark && (
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Landmark: {rescue.pickupLandmark}
              </p>
            )}

            {/* Revealed donor phone */}
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <a
                href={`tel:${rescue.donorPhone || '+919876543210'}`}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                <Phone size={12} />
                <span>Call Donor ({rescue.donorPhone || 'Contact'})</span>
              </a>
            </div>

            {currentStepIndex === 1 && (
              <div style={{ marginTop: '12px' }}>
                <Button
                  variant="primary"
                  block
                  icon={MapPin}
                  onClick={handleArrivedAtPickup}
                >
                  Mark: Arrived at Pickup Point
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Arrived & Confirm Pickup */}
        <div className={`step-card ${currentStepIndex === 2 ? 'active' : currentStepIndex > 2 ? 'completed' : 'disabled'}`}>
          <div className="step-icon-wrap">
            {currentStepIndex > 2 ? <CheckCircle2 size={18} /> : 2}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>2. Collect Food & Confirm Pickup</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Inspect food condition, load securely into vehicle, and verify quantity ({rescue.quantityMeals} meals).
            </p>

            {currentStepIndex === 2 && (
              <div style={{ marginTop: '12px' }}>
                <Button
                  variant="primary"
                  block
                  icon={CheckCircle2}
                  onClick={() => setIsPickupConfirmOpen(true)}
                >
                  Confirm: Food Picked Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Transit to Destination & Submit Proof */}
        <div className={`step-card ${currentStepIndex === 3 ? 'active' : currentStepIndex > 3 ? 'completed' : 'disabled'}`}>
          <div className="step-icon-wrap">
            {currentStepIndex > 3 ? <CheckCircle2 size={18} /> : 3}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>3. Transport to Destination</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <strong>Dropoff Target:</strong> {rescue.destinationName || 'Pragati Shelter Kitchen (Ward 4)'}
            </p>

            {currentStepIndex === 3 && (
              <div style={{ marginTop: '12px' }}>
                <Button
                  variant="success"
                  block
                  size="lg"
                  icon={Camera}
                  onClick={() => setIsProofModalOpen(true)}
                >
                  Submit Distribution Proof & Photos
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Admin Verification State */}
        {currentStepIndex === 4 && (
          <div className="as-card" style={{ borderLeft: '4px solid var(--status-urgent-solid)', textAlign: 'center', padding: '16px' }}>
            <div style={{ color: 'var(--status-urgent-solid)', marginBottom: '6px' }}>
              <Clock size={28} style={{ margin: '0 auto' }} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
              Proof Submitted — Awaiting Admin Review
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Your distribution photos and headcount are now with the AnnaSetu verification desk. The rescue will officially close once checked.
            </p>
          </div>
        )}
      </div>

      {/* Confirm Pickup Modal with Photo Capture */}
      <Modal
        isOpen={isPickupConfirmOpen}
        onClose={() => setIsPickupConfirmOpen(false)}
        title="Food Collection & Pickup Verification"
        subtitle={`Collect from ${rescue.donorName || 'Donor'} • ${rescue.quantityMeals} Meals`}
        maxWidth="540px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPickupConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={CheckCircle2} onClick={handleConfirmPickup}>
              Confirm Pickup & Begin Transit
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Take or upload a photo of the food containers loaded into your vehicle at the pickup location:
          </p>

          <PhotoCaptureInput
            value={pickupPhoto}
            onChange={(photo) => setPickupPhoto(photo)}
            label="Pickup Food Photo Verification"
            subtitle="Take photo with camera or upload picture"
            checkpointText={`📍 Donor Premises Stamp: ${rescue.pickupAddress?.split(',')[0]} (${new Date().toLocaleTimeString()})`}
            samplePhotos={SAMPLE_FOOD_PHOTOS}
          />

          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            ✓ Verified packaging and container seals<br />
            ✓ Verified quantity ({rescue.quantityMeals} meals)<br />
            ✓ Ready for transit to {rescue.destinationName || 'Destination'}
          </div>
        </div>
      </Modal>

      {/* Submit Proof Modal */}
      <SubmitProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        donation={rescue}
        onSubmitProof={handleProofSubmitted}
      />
    </div>
  );
};
