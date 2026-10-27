import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { StatusChip } from '../../components/common/StatusChip';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { HeroImageSlider } from '../../components/home/HeroImageSlider';
import { Modal } from '../../components/common/Modal';
import { DONATION_STATUS } from '../../constants/donationStatus';
import {
  Bike,
  Navigation,
  Inbox,
  Clock,
  MapPin,
  Utensils,
  ChevronRight,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Power,
  Phone,
  Building,
  AlertTriangle,
  Edit3,
  Bell,
  ShieldCheck
} from 'lucide-react';

export const VolunteerDashboard = ({
  volunteer,
  donations = [],
  onToggleAvailability,
  onNavigateOffers,
  onNavigateActiveRescue,
  onSelectDonation,
  onAcceptOffer,
  onDeclineOffer,
  onOpenEditProfile
}) => {
  const [selectedOfferForDecline, setSelectedOfferForDecline] = useState(null);
  const [declineReason, setDeclineReason] = useState('Traffic / distance too far');
  const [confirmAcceptOffer, setConfirmAcceptOffer] = useState(null);

  // Active rescue assigned to this volunteer
  const activeRescue = donations.find(
    d => (d.assignedVolunteerId === volunteer?.id || d.assignedVolunteerName === volunteer?.name) &&
         (d.status === DONATION_STATUS.ACCEPTED ||
          d.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP ||
          d.status === DONATION_STATUS.PICKED_UP ||
          d.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS ||
          d.status === DONATION_STATUS.PROOF_SUBMITTED)
  );

  // Pending assignment offers for this volunteer or matching route
  const availableOffers = donations.filter(
    d => (d.status === DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE &&
          (d.assignedVolunteerId === volunteer?.id || d.assignedVolunteerName === volunteer?.name)) ||
         (d.status === DONATION_STATUS.APPROVED_FOR_MATCHING && !d.assignedVolunteerId)
  );

  const handleConfirmAccept = () => {
    if (confirmAcceptOffer && onAcceptOffer) {
      onAcceptOffer(confirmAcceptOffer.id);
      setConfirmAcceptOffer(null);
    }
  };

  const handleConfirmDecline = () => {
    if (selectedOfferForDecline && onDeclineOffer) {
      onDeclineOffer(selectedOfferForDecline.id, declineReason);
      setSelectedOfferForDecline(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* 1. Hero Image Slider / Banner at top of homepage below navbar */}
      <HeroImageSlider />

      {/* Volunteer Identity Card with Edit Profile & Online Toggle */}
      <div className="as-card as-card-elevated" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--brand-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '17px',
                flexShrink: 0
              }}
            >
              {volunteer?.name ? volunteer.name[0] : 'V'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '16.5px', fontWeight: 800, margin: 0 }}>{volunteer?.name || 'Aarav Patel'}</h1>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    backgroundColor: 'var(--status-success-bg)',
                    color: 'var(--status-success-solid)',
                    border: '1px solid var(--status-success-border)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  VERIFIED SEVAK
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '1px 0 0' }}>
                {volunteer?.transportType} • {volunteer?.maximumDistanceKm || 12}km radius
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenEditProfile && (
              <Button
                variant="outline"
                size="sm"
                icon={Edit3}
                onClick={onOpenEditProfile}
                style={{ padding: '5px 10px', fontSize: '11.5px' }}
              >
                Edit Profile
              </Button>
            )}

            {/* Availability Toggle */}
            <button
              type="button"
              onClick={onToggleAvailability}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 11px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: volunteer?.isAvailable ? 'var(--status-success-bg)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${volunteer?.isAvailable ? 'var(--status-success-border)' : 'var(--border-default)'}`,
                color: volunteer?.isAvailable ? 'var(--status-success-solid)' : 'var(--text-tertiary)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Power size={12} />
              <span>{volunteer?.isAvailable ? 'Online' : 'Offline'}</span>
            </button>
          </div>
        </div>

        {/* Corridor Route summary */}
        <div
          style={{
            padding: '8px 10px',
            backgroundColor: 'var(--brand-50)',
            border: '1px solid var(--brand-100)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11.5px'
          }}
        >
          <Navigation size={13} style={{ color: 'var(--brand-600)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--brand-800)' }}>Your Route: </span>
            <span style={{ color: 'var(--brand-700)' }}>{volunteer?.preferableRoute || 'Indiranagar ➔ Domlur ➔ Koramangala'}</span>
          </div>
        </div>
      </div>

      {/* PRIORITY 1: AVAILABLE FOOD PICKUP NOTIFICATIONS & OFFERS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bell size={16} style={{ color: 'var(--brand-600)' }} />
            <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
              Available Food Pickups ({availableOffers.length})
            </h2>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Real-time rescue dispatches
          </span>
        </div>

        {availableOffers.length === 0 ? (
          <div className="as-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-500)',
                margin: '0 auto 8px'
              }}
            >
              <Inbox size={20} />
            </div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '4px' }}>
              No Pending Food Pickups in Queue
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto' }}>
              Your commute corridor is active. As soon as a donor posts surplus food near your route, an alert will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {availableOffers.map((offer) => (
              <div
                key={offer.id}
                className="as-card as-card-elevated animate-pulse-glow"
                style={{
                  border: '2px solid var(--brand-500)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '14px'
                }}
              >
                {/* Header Tag & Countdown */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      ⚡ Food Ready for Pickup • Ref #{offer.publicReference}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0 2px', color: 'var(--text-primary)' }}>
                      {offer.quantityMeals} Meals • {offer.foodDescription}
                    </h3>
                  </div>
                  <CountdownTimer targetTime={offer.safeConsumptionDeadline} compact />
                </div>

                {/* 1. Food Donor Details Card */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--brand-700)', textTransform: 'uppercase' }}>
                    Food Donor Contact & Details
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {offer.donorName || 'Rajesh Sharma'}
                      </div>
                      {offer.donorOrg && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {offer.donorOrg}
                        </div>
                      )}
                    </div>

                    {offer.donorPhone && (
                      <a
                        href={`tel:${offer.donorPhone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'var(--brand-50)',
                          border: '1px solid var(--brand-200)',
                          color: 'var(--brand-700)',
                          padding: '5px 9px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <Phone size={12} />
                        <span>Call Donor</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* 2. Route & Location Details */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={15} style={{ color: 'var(--brand-500)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: '#1E293B', display: 'block', fontSize: '12px' }}>
                        Pickup Location:
                      </strong>
                      <span style={{ color: '#475569', fontSize: '11.5px', lineHeight: 1.35 }}>
                        {offer.pickupAddress} {offer.pickupLandmark ? `(${offer.pickupLandmark})` : ''}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Building size={15} style={{ color: 'var(--status-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: '#1E293B', display: 'block', fontSize: '12px' }}>
                        Delivery Destination:
                      </strong>
                      <span style={{ color: '#475569', fontSize: '11.5px' }}>
                        {offer.destinationName || 'Pragati Shelter Kitchen (Ward 4)'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--brand-700)', fontWeight: 600 }}>
                    <Navigation size={12} />
                    <span>Along your corridor route (~2.4 km from your path)</span>
                  </div>
                </div>

                {/* 3. TWO CLEAR OPTIONS: ACCEPT REQUEST OR REJECT DELIVERY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px', marginTop: '2px' }}>
                  <Button
                    type="button"
                    variant="outline"
                    icon={XCircle}
                    onClick={() => setSelectedOfferForDecline(offer)}
                    style={{
                      borderColor: 'var(--status-danger-border)',
                      color: 'var(--status-danger-solid)',
                      padding: '8px 10px',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    Reject Delivery
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    icon={CheckCircle2}
                    onClick={() => setConfirmAcceptOffer(offer)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 800
                    }}
                  >
                    Accept Request
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRIORITY 2: ACTIVE RESCUE TASK (IF UNDERTAKEN) */}
      {activeRescue && (
        <div
          className="as-card as-card-elevated"
          style={{ borderLeft: '4px solid var(--status-success-solid)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--status-success-solid)', textTransform: 'uppercase' }}>
                Active Rescue Task In Progress
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>
                {activeRescue.foodDescription}
              </h3>
            </div>
            <StatusChip status={activeRescue.status} />
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: 700 }}>
              <Utensils size={14} style={{ color: 'var(--brand-500)' }} />
              {activeRescue.quantityMeals} Meals
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} style={{ color: 'var(--text-tertiary)' }} />
              {activeRescue.destinationName || 'Approved Shelter'}
            </span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <CountdownTimer targetTime={activeRescue.safeConsumptionDeadline} />
          </div>

          <Button
            variant="success"
            block
            size="md"
            icon={Navigation}
            onClick={onNavigateActiveRescue}
            style={{ fontWeight: 800 }}
          >
            Continue Rescue Checkpoints & Route
          </Button>
        </div>
      )}

      {/* Volunteer Community Impact Stats */}
      <div className="responsive-2col">
        <div
          className="as-card"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'linear-gradient(135deg, #FFFDF8 0%, #FEF8ED 100%)',
            borderColor: '#F4E2C7'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-700)', marginBottom: '4px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--brand-600)' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 650 }}>Rescues Done</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-display)' }}>
            {volunteer?.completedRescues || 18}
          </span>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Timely deliveries
          </p>
        </div>

        <div
          className="as-card"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'linear-gradient(135deg, #F8FDFB 0%, #EEF9F3 100%)',
            borderColor: '#D1EFE0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-success-solid)', marginBottom: '4px' }}>
            <UtensilsCrossed size={14} style={{ color: 'var(--status-success-solid)' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 650 }}>Meals Distributed</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-display)' }}>
            {volunteer?.mealsDistributed || 2150}
          </span>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Direct nourishment
          </p>
        </div>
      </div>

      {/* Confirmation Modal to Accept Rescue */}
      <Modal
        isOpen={Boolean(confirmAcceptOffer)}
        onClose={() => setConfirmAcceptOffer(null)}
        title="Commit to Food Rescue"
        subtitle={`Ref #${confirmAcceptOffer?.publicReference} • ${confirmAcceptOffer?.quantityMeals} Meals`}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmAcceptOffer(null)}>
              Cancel
            </Button>
            <Button variant="success" icon={CheckCircle2} onClick={handleConfirmAccept}>
              Yes, I Accept This Rescue
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            By accepting, you commit to picking up <strong>{confirmAcceptOffer?.foodDescription}</strong> promptly from <strong>{confirmAcceptOffer?.pickupAddress}</strong> and delivering it with dignity before the safe deadline.
          </p>

          <div className="as-card" style={{ borderLeft: '4px solid var(--brand-500)', padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Donor Phone:</span>
              <strong style={{ color: 'var(--brand-700)' }}>{confirmAcceptOffer?.donorPhone || '+91 99887 76655'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dropoff Shelter:</span>
              <strong>{confirmAcceptOffer?.destinationName || 'Pragati Shelter Kitchen'}</strong>
            </div>
          </div>
        </div>
      </Modal>

      {/* Decline Reason Modal */}
      <Modal
        isOpen={Boolean(selectedOfferForDecline)}
        onClose={() => setSelectedOfferForDecline(null)}
        title="Reject Delivery Request"
        subtitle="This will immediately return the food to the matching queue for another volunteer."
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedOfferForDecline(null)}>
              Back
            </Button>
            <Button variant="danger" onClick={handleConfirmDecline}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700 }}>Reason for rejection:</label>
          <select
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}
          >
            <option value="Traffic / distance too far">Traffic / distance too far</option>
            <option value="Vehicle issue / unavailable right now">Vehicle issue / unavailable right now</option>
            <option value="Capacity constraint (batch too large)">Quantity too large for my vehicle</option>
            <option value="Personal emergency">Personal emergency</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};
