import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { DONATION_STATUS } from '../../constants/donationStatus';
import { AreaDispatchMap } from './AreaDispatchMap';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Bike,
  MapPin,
  Clock,
  Utensils,
  UserCheck,
  Navigation,
  ShieldCheck,
  Phone
} from 'lucide-react';

export const DonationReviewModal = ({
  isOpen,
  onClose,
  donation,
  destinations = [],
  volunteers = [],
  onApproveAndAssign,
  onReject
}) => {
  const [selectedDestinationId, setSelectedDestinationId] = useState(destinations[0]?.id || 'dest-01');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(
    volunteers.find(v => v.status === 'VERIFIED_ACTIVE')?.id || 'vol-01'
  );
  const [safetyChecks, setSafetyChecks] = useState({
    freshnessChecked: true,
    hygieneChecked: true,
    donorVerified: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever donation or lists change
  useEffect(() => {
    if (donation) {
      if (donation.destinationId) {
        setSelectedDestinationId(donation.destinationId);
      } else if (destinations.length > 0) {
        setSelectedDestinationId(destinations[0].id);
      }

      if (donation.assignedVolunteerId) {
        setSelectedVolunteerId(donation.assignedVolunteerId);
      } else {
        const verifiedOnline = volunteers.find(v => v.status === 'VERIFIED_ACTIVE' && v.isAvailable);
        const verifiedAny = volunteers.find(v => v.status === 'VERIFIED_ACTIVE');
        if (verifiedOnline) {
          setSelectedVolunteerId(verifiedOnline.id);
        } else if (verifiedAny) {
          setSelectedVolunteerId(verifiedAny.id);
        }
      }
    }
  }, [donation, destinations, volunteers]);

  const destination = destinations.find(d => d.id === selectedDestinationId) || destinations[0];
  const volunteer = volunteers.find(v => v.id === selectedVolunteerId) || volunteers[0];

  // Check if selected volunteer's route matches the donation's pickup address
  const isCorridorMatch = useMemo(() => {
    if (!volunteer || !donation?.pickupAddress) return false;
    const addr = donation.pickupAddress.toLowerCase();
    const route = (volunteer.preferableRoute || '').toLowerCase();
    const areas = Array.isArray(volunteer.serviceAreas)
      ? volunteer.serviceAreas.join(' ').toLowerCase()
      : (volunteer.serviceAreas || '').toLowerCase();

    return (
      (addr.includes('indiranagar') && (route.includes('indiranagar') || areas.includes('indiranagar'))) ||
      (addr.includes('whitefield') && (route.includes('whitefield') || areas.includes('whitefield'))) ||
      (addr.includes('shivaji') && (route.includes('shivaji') || areas.includes('shivaji'))) ||
      (addr.includes('ring rd') && route.includes('koramangala')) ||
      (addr.includes('bda') && route.includes('indiranagar'))
    );
  }, [volunteer, donation]);

  // ALL HOOKS CALLED — NOW SAFE FOR EARLY RETURN
  if (!isOpen || !donation) return null;

  const meals = Number(donation.quantityMeals) || 0;
  const isTransportAppropriate = meals > 150
    ? (volunteer?.transportType?.includes('Car') || volunteer?.transportType?.includes('Van') || volunteer?.transportType?.includes('Four-Wheeler'))
    : true;

  const handleDispatch = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onApproveAndAssign(donation.id, {
        destinationId: destination?.id || selectedDestinationId,
        destinationName: destination?.name || 'Pragati Shelter Kitchen',
        assignedVolunteerId: volunteer?.id || selectedVolunteerId,
        assignedVolunteerName: volunteer?.name || 'Aarav Patel',
        assignmentResponseBy: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins countdown
        statusNote: `Admin approved report. Assigned dropoff to ${destination?.name || 'Shelter'} and dispatched offer to volunteer ${volunteer?.name || 'Volunteer'} (Corridor Match: ${isCorridorMatch ? 'Yes (Zero Detour)' : 'Standard'}).`
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Review & Intelligent Dispatch"
      subtitle={`Donation #${donation.publicReference} • ${donation.quantityMeals} Meals • ${donation.eventType}`}
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Top Summary Card */}
        <div className="as-card as-card-elevated" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '12px' }}>
          {donation.foodPhoto && (
            <img
              src={donation.foodPhoto}
              alt="Food item"
              style={{ width: '110px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-default)' }}
            />
          )}
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{donation.foodDescription}</h3>
              <CountdownTimer targetTime={donation.safeConsumptionDeadline} compact />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', marginTop: '4px' }}>
              <span style={{ fontWeight: 800, color: 'var(--brand-600)' }}>
                {donation.quantityMeals} Meals
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Donor: <strong>{donation.donorName}</strong> {donation.donorOrg ? `(${donation.donorOrg})` : ''}
              </span>
              {donation.donorPhone && (
                <span style={{ color: 'var(--text-secondary)' }}>
                  📞 {donation.donorPhone}
                </span>
              )}
            </div>

            <p style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '4px', lineHeight: 1.35 }}>
              📍 <strong>Pickup Address:</strong> {donation.pickupAddress} {donation.pickupLandmark ? `(Landmark: ${donation.pickupLandmark})` : ''}
            </p>
          </div>
        </div>

        {/* Food Safety & Freshness Verification Checkbox Bar */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: '#166534' }}>
            <ShieldCheck size={14} style={{ color: '#16A34A' }} />
            <span>Admin Quality & Food Safety Checklist:</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '11px', color: '#14532D' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={safetyChecks.freshnessChecked}
                onChange={(e) => setSafetyChecks({ ...safetyChecks, freshnessChecked: e.target.checked })}
                style={{ width: '14px', height: '14px', accentColor: '#16A34A' }}
              />
              <span>Freshness & Deadline Verified</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={safetyChecks.hygieneChecked}
                onChange={(e) => setSafetyChecks({ ...safetyChecks, hygieneChecked: e.target.checked })}
                style={{ width: '14px', height: '14px', accentColor: '#16A34A' }}
              />
              <span>Clean Trays / Sealed Packaging Checked</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={safetyChecks.donorVerified}
                onChange={(e) => setSafetyChecks({ ...safetyChecks, donorVerified: e.target.checked })}
                style={{ width: '14px', height: '14px', accentColor: '#16A34A' }}
              />
              <span>Donor Phone Authenticated</span>
            </label>
          </div>
        </div>

        {/* Operational Plan: Destination & Volunteer Match */}
        <div className="responsive-2col">
          {/* Destination Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '4px' }}>
              1. Match Shelter Destination (Capacity Allocation) *
            </label>
            <select
              value={selectedDestinationId}
              onChange={(e) => setSelectedDestinationId(e.target.value)}
              style={{ fontSize: '12px', padding: '7px 8px' }}
            >
              {destinations.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.capacityMeals} meals capacity)
                </option>
              ))}
            </select>
            {destination && (
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', lineHeight: 1.3 }}>
                <span style={{ color: 'var(--status-success-solid)', fontWeight: 600 }}>✓ Verified Shelter: </span>
                {destination.address} • Contact: {destination.contactPerson} ({destination.contactPhone})
              </div>
            )}
          </div>

          {/* Volunteer Matcher with Corridor & Traffic Intelligence */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '4px' }}>
              2. Assign Volunteer (Corridor & Traffic Optimization) *
            </label>
            <select
              value={selectedVolunteerId}
              onChange={(e) => setSelectedVolunteerId(e.target.value)}
              style={{ fontSize: '12px', padding: '7px 8px' }}
            >
              {[...volunteers]
                .filter(v => v.status === 'VERIFIED_ACTIVE')
                .sort((a, b) => (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0))
                .map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.transportType} • {v.isAvailable ? '🟢 Online & Ready' : '⚪ Offline'})
                  </option>
                ))}
            </select>
            {volunteer && (
              <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Corridor: <strong>{volunteer.preferableRoute || 'Commute Route'}</strong>
                </div>

                {/* Corridor & Traffic Match Badge */}
                {isCorridorMatch ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      fontSize: '10.5px',
                      fontWeight: 700
                    }}
                  >
                    <Navigation size={11} />
                    <span>✓ Recommended: Commute Corridor Matches Pickup (Zero Extra Detour Traffic)</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>
                    Radius: {volunteer.maximumDistanceKm} km • Rescues: {volunteer.completedRescues}
                  </div>
                )}

                {/* Vehicle Check */}
                {!isTransportAppropriate && (
                  <div style={{ fontSize: '10.5px', color: '#B45309', fontWeight: 600 }}>
                    ⚠️ Large batch ({meals} meals) — A 4-wheeler or cargo vehicle is advised.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Area Dispatch Map: Real-time Volunteer Proximity & Tracking */}
        <AreaDispatchMap
          donation={donation}
          destination={destination}
          volunteers={volunteers}
          selectedVolunteerId={selectedVolunteerId}
          onSelectVolunteer={(id) => setSelectedVolunteerId(id)}
        />

        {/* Dispatch Protocol Banner */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '9px 12px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Clock size={15} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
          <span>
            Dispatching this offer will immediately notify <strong>{volunteer?.name}</strong> with donor contact details and route checkpoints. The volunteer has 15 minutes to accept before automated fallback reassignment.
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
          {donation.status === DONATION_STATUS.SUBMITTED || donation.status === DONATION_STATUS.UNDER_REVIEW ? (
            <Button
              variant="outline"
              icon={XCircle}
              onClick={() => onReject(donation.id)}
              style={{ color: 'var(--status-danger-solid)', borderColor: 'var(--status-danger-border)', fontSize: '11.5px', padding: '6px 12px' }}
            >
              Reject Report
            </Button>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Current Status: <strong style={{ color: 'var(--text-primary)' }}>{donation.status}</strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={onClose} style={{ fontSize: '11.5px' }}>
              {donation.status === DONATION_STATUS.SUBMITTED || donation.status === DONATION_STATUS.UNDER_REVIEW ? 'Cancel' : 'Close'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              loading={isSubmitting}
              onClick={handleDispatch}
              style={{ fontWeight: 800, fontSize: '12px' }}
            >
              {donation.status === DONATION_STATUS.SUBMITTED || donation.status === DONATION_STATUS.UNDER_REVIEW ? 'Approve & Dispatch Assignment Offer' : 'Update & Re-assign Courier'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
