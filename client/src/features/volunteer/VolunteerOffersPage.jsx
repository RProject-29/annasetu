import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { Modal } from '../../components/common/Modal';
import { DONATION_STATUS } from '../../constants/donationStatus';
import {
  Inbox,
  Clock,
  MapPin,
  Utensils,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  ArrowRight
} from 'lucide-react';

export const VolunteerOffersPage = ({
  offers = [],
  onAcceptOffer,
  onDeclineOffer,
  onBack
}) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('Traffic / distance too far');

  const handleOpenAccept = (offer) => {
    setSelectedOffer(offer);
    setIsConfirmModalOpen(true);
  };

  const handleOpenDecline = (offer) => {
    setSelectedOffer(offer);
    setIsDeclineModalOpen(true);
  };

  const confirmAccept = () => {
    if (selectedOffer) {
      onAcceptOffer(selectedOffer.id);
      setIsConfirmModalOpen(false);
      setSelectedOffer(null);
    }
  };

  const confirmDecline = () => {
    if (selectedOffer) {
      onDeclineOffer(selectedOffer.id, declineReason);
      setIsDeclineModalOpen(false);
      setSelectedOffer(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Rescue Assignment Offers</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Assigned by AnnaSetu admin based on your service radius and transport capability.
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="as-card" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
          <Inbox size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
            No Pending Offers
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            You will receive an in-app alert when an admin dispatches a nearby rescue to you.
          </p>
        </div>
      ) : (
        offers.map(offer => (
          <div
            key={offer.id}
            className="as-card as-card-elevated"
            style={{
              borderLeft: '4px solid var(--brand-500)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-500)', textTransform: 'uppercase' }}>
                  Assignment Offer #{offer.publicReference}
                </span>
                <h2 style={{ fontSize: '17px', fontWeight: 800, marginTop: '2px' }}>
                  {offer.foodDescription}
                </h2>
              </div>
              <CountdownTimer targetTime={offer.safeConsumptionDeadline} compact />
            </div>

            {/* Core facts */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: 700 }}>
                <Utensils size={14} style={{ color: 'var(--brand-500)' }} />
                {offer.quantityMeals} Meals
              </span>
              <span>•</span>
              <span style={{ color: 'var(--text-secondary)' }}>{offer.eventType}</span>
            </div>

            {/* Route details */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} style={{ color: 'var(--brand-500)', flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <strong style={{ color: '#f8fafc' }}>Pickup Location (Est. 2.4 km away):</strong>
                  <div style={{ color: 'var(--text-secondary)' }}>{offer.pickupAddress}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Building size={15} style={{ color: 'var(--status-success-solid)', flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <strong style={{ color: '#f8fafc' }}>Assigned Dropoff Destination:</strong>
                  <div style={{ color: 'var(--text-secondary)' }}>{offer.destinationName || 'Pragati Shelter Kitchen'}</div>
                </div>
              </div>
            </div>

            {/* Handling note */}
            {offer.handlingNotes && (
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                Note: {offer.handlingNotes}
              </div>
            )}

            {/* Accept / Decline Action Controls */}
            <div className="responsive-2col" style={{ marginTop: '4px' }}>
              <Button
                variant="outline"
                icon={XCircle}
                onClick={() => handleOpenDecline(offer)}
              >
                Decline
              </Button>
              <Button
                variant="primary"
                icon={CheckCircle2}
                onClick={() => handleOpenAccept(offer)}
              >
                Accept Rescue
              </Button>
            </div>
          </div>
        ))
      )}

      {/* Confirmation Modal to Accept Rescue */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Commit to Food Rescue"
        subtitle={`Reference #${selectedOffer?.publicReference}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" icon={CheckCircle2} onClick={confirmAccept}>
              Yes, I Accept This Rescue
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            By accepting, you commit to reaching the pickup location promptly and delivering the food to the designated shelter before the safe-consumption deadline.
          </p>

          <div className="as-card" style={{ borderLeft: '4px solid var(--status-urgent-solid)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Food Quantity:</span>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{selectedOffer?.quantityMeals} Meals</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Safe-Consumption Deadline:</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--status-urgent-text)' }}>
                {selectedOffer?.safeConsumptionDeadline && new Date(selectedOffer.safeConsumptionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Decline Reason Modal */}
      <Modal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        title="Decline Assignment"
        subtitle="This will return the rescue to admin for immediate reassignment."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeclineModalOpen(false)}>
              Back
            </Button>
            <Button variant="danger" onClick={confirmDecline}>
              Confirm Decline
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600 }}>Please select a reason:</label>
          <select
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          >
            <option value="Traffic / distance too far">Traffic / distance too far</option>
            <option value="Vehicle issue / unavailable">Vehicle issue / unavailable</option>
            <option value="Capacity constraint (quantity too large)">Quantity too large for my transport</option>
            <option value="Emergency personal conflict">Emergency personal conflict</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};
