import React, { useState } from 'react';
import { StatusChip } from '../../components/common/StatusChip';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { DONATION_STATUS } from '../../constants/donationStatus';
import { Utensils, Calendar, MapPin, ChevronRight, Filter } from 'lucide-react';

export const DonorHistoryPage = ({ donations = [], onSelectDonation }) => {
  const [filter, setFilter] = useState('ALL'); // ALL | ACTIVE | COMPLETED

  const filtered = donations.filter(d => {
    if (filter === 'ACTIVE') {
      return d.status !== DONATION_STATUS.COMPLETED &&
             d.status !== DONATION_STATUS.CANCELLED &&
             d.status !== DONATION_STATUS.EXPIRED;
    }
    if (filter === 'COMPLETED') {
      return d.status === DONATION_STATUS.COMPLETED;
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Donation History</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Review all your recorded food reports and past distributions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
        {[
          { id: 'ALL', label: `All (${donations.length})` },
          { id: 'ACTIVE', label: 'Active' },
          { id: 'COMPLETED', label: 'Completed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: filter === tab.id ? 'var(--brand-500)' : 'transparent',
              color: filter === tab.id ? '#0b1120' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Donation List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div className="as-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
              No donations match this filter.
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="as-card as-card-interactive"
              onClick={() => onSelectDonation(item)}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', fontFamily: 'var(--font-family-mono)' }}>
                    REF #{item.publicReference}
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px', color: '#f8fafc' }}>
                    {item.foodDescription}
                  </h3>
                </div>
                <StatusChip status={item.status} />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <Utensils size={13} style={{ color: 'var(--brand-500)' }} />
                  {item.quantityMeals} Meals
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} style={{ color: 'var(--text-tertiary)' }} />
                  {item.pickupAddress?.split(',')[0]}
                </span>
              </div>

              {item.status !== DONATION_STATUS.COMPLETED && item.safeConsumptionDeadline && (
                <div style={{ marginTop: '2px' }}>
                  <CountdownTimer targetTime={item.safeConsumptionDeadline} compact />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
