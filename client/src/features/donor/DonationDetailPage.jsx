import React from 'react';
import { Button } from '../../components/common/Button';
import { StatusChip } from '../../components/common/StatusChip';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { RescueTimeline } from '../../components/timeline/RescueTimeline';
import {
  ArrowLeft,
  MapPin,
  Utensils,
  Phone,
  User,
  Shield,
  Bike,
  CheckCircle2,
  AlertCircle,
  Camera,
  Sparkles
} from 'lucide-react';

export const DonationDetailPage = ({ donation, onBack }) => {
  if (!donation) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', fontFamily: 'var(--font-family-mono)' }}>
          REF: #{donation.publicReference}
        </span>
      </div>

      {/* Main Status Card */}
      <div className="as-card as-card-elevated">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Status
            </span>
            <div style={{ marginTop: '4px' }}>
              <StatusChip status={donation.status} />
            </div>
          </div>
          {donation.safeConsumptionDeadline && (
            <CountdownTimer targetTime={donation.safeConsumptionDeadline} />
          )}
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '10px', marginBottom: '6px' }}>
          {donation.foodDescription}
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: 600 }}>
            <Utensils size={14} style={{ color: 'var(--brand-500)' }} />
            {donation.quantityMeals} Meals
          </span>
          <span>•</span>
          <span>{donation.eventType}</span>
        </div>
      </div>

      {/* Verified Delivery Outcome & Side-by-Side Photo Comparison */}
      {donation.proofDetails && (donation.status === 'COMPLETED' || donation.status === 'PROOF_SUBMITTED') ? (
        <div className="as-card as-card-elevated" style={{ borderLeft: '4px solid #10b981', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: '#10b981' }} />
              <strong style={{ fontSize: '14px', color: '#065f46' }}>
                {donation.status === 'COMPLETED' ? '✓ Delivery Confirmed & Verified by Admin' : 'Distribution Evidence Submitted'}
              </strong>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#065f46',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {donation.proofDetails.peopleServed || donation.quantityMeals} People Served Warm Meals
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: donation.pickupPhoto ? 'repeat(auto-fit, minmax(190px, 1fr))' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {/* 1. Food Reported by Donor */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface-elevated)' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={donation.foodPhoto}
                  alt="Food reported by donor"
                  style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#f8fafc',
                    padding: '2px 7px',
                    borderRadius: '4px'
                  }}
                >
                  1. Food You Reported ({donation.quantityMeals} Meals)
                </span>
              </div>
              <div style={{ padding: '8px 10px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                {donation.foodDescription}
              </div>
            </div>

            {/* 2. Food Collected by Volunteer at Pickup */}
            {donation.pickupPhoto && (
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #38bdf8', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={donation.pickupPhoto}
                    alt="Food collected at pickup"
                    style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(56, 189, 248, 0.9)',
                      color: '#0b1120',
                      padding: '2px 7px',
                      borderRadius: '4px'
                    }}
                  >
                    2. Picked Up from Your Premises
                  </span>
                </div>
                <div style={{ padding: '8px 10px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  Handed to: <strong>{donation.assignedVolunteerName || 'Courier'}</strong>
                </div>
              </div>
            )}

            {/* 3. Food Delivered at Shelter */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #86efac', backgroundColor: 'var(--bg-surface-elevated)' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={donation.proofDetails.distributionPhoto || donation.foodPhoto}
                  alt="Food delivered at shelter"
                  style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(16, 185, 129, 0.9)',
                    color: '#ffffff',
                    padding: '2px 7px',
                    borderRadius: '4px'
                  }}
                >
                  {donation.pickupPhoto ? '3.' : '2.'} Delivered & Served at Destination
                </span>
              </div>
              <div style={{ padding: '8px 10px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                Delivered by: <strong>{donation.assignedVolunteerName || 'Courier'}</strong> ➔ {donation.destinationName || 'Verified Shelter'}
              </div>
            </div>
          </div>

          {donation.proofDetails.notes && (
            <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <strong>Volunteer Distribution Note:</strong> "{donation.proofDetails.notes}"
            </div>
          )}
        </div>
      ) : donation.foodPhoto ? (
        /* Standard Food Photo Card before delivery */
        <div className="as-card" style={{ padding: '0', overflow: 'hidden' }}>
          <img
            src={donation.foodPhoto}
            alt="Food item preview"
            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
          />
          <div style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong>Handling Notes:</strong> {donation.handlingNotes || 'Standard handling'}
          </div>
        </div>
      ) : null}

      {/* Pickup Location Info */}
      <div className="as-card">
        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} style={{ color: 'var(--brand-500)' }} />
          <span>Pickup Location</span>
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
          {donation.pickupAddress}
        </p>
        {donation.pickupLandmark && (
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Landmark: {donation.pickupLandmark}
          </p>
        )}
      </div>

      {/* Assigned Volunteer (if active) */}
      {donation.assignedVolunteerName && (
        <div className="as-card" style={{ borderLeft: '4px solid var(--status-success-solid)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bike size={16} style={{ color: 'var(--status-success-solid)' }} />
            <span>Assigned Volunteer</span>
          </h3>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {donation.assignedVolunteerName}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Verified Community Rescue Volunteer
          </p>
        </div>
      )}

      {/* Destination Info (if assigned) */}
      {donation.destinationName && (
        <div className="as-card">
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
            Assigned Distribution Target
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {donation.destinationName}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Admin-verified shelter or registered care home
          </p>
        </div>
      )}

      {/* Rescue Progress Timeline */}
      <div className="as-card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
          Rescue Activity Timeline
        </h3>
        <RescueTimeline events={donation.timeline || []} />
      </div>

      <Button variant="secondary" block onClick={onBack}>
        Close Details
      </Button>
    </div>
  );
};
