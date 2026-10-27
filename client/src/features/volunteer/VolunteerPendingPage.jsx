import React from 'react';
import { Button } from '../../components/common/Button';
import { Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const VolunteerPendingPage = ({
  volunteer,
  onSimulateAdminApproval,
  onSwitchToVerified
}) => {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-6) var(--space-2)', textAlign: 'center' }}>
      {/* Icon */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--status-urgent-bg)',
          border: '2px solid var(--status-urgent-border)',
          color: 'var(--status-urgent-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)'
        }}
      >
        <Clock size={36} />
      </div>

      <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
        Application Under Review
      </h1>

      <span
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '16px'
        }}
      >
        STATUS: PENDING VERIFICATION
      </span>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto var(--space-6)' }}>
        Thank you, <strong>{volunteer?.name || 'Volunteer'}</strong>! An AnnaSetu administrator is reviewing your ID documents and route preferences.
      </p>

      {/* Verification Stepper Flow Indicator */}
      <div className="as-card" style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          Onboarding Progress:
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--status-success-solid)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>1. Profile & ID Document Submitted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--status-urgent-solid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-urgent-solid)' }} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--status-urgent-text)' }}>
              2. Admin Identity & Safety Check (Current Step)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5 }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-tertiary)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>3. Activated for Rescue Assignments</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {onSimulateAdminApproval && (
          <Button
            variant="success"
            block
            icon={CheckCircle2}
            onClick={onSimulateAdminApproval}
          >
            Approve Application (Instant Test)
          </Button>
        )}

        {onSwitchToVerified && (
          <Button
            variant="outline"
            block
            icon={ArrowRight}
            onClick={onSwitchToVerified}
          >
            Switch to Verified Volunteer (Aarav)
          </Button>
        )}
      </div>
    </div>
  );
};
