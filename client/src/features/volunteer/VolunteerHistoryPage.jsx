import React, { useState } from 'react';
import { StatusChip } from '../../components/common/StatusChip';
import { DONATION_STATUS } from '../../constants/donationStatus';
import { Utensils, Calendar, MapPin, ChevronRight, Bike, CheckCircle2 } from 'lucide-react';

export const VolunteerHistoryPage = ({
  volunteer,
  donations = [],
  onSelectDonation,
  onBack
}) => {
  const [filter, setFilter] = useState('ALL'); // ALL | COMPLETED | ACTIVE

  const volunteerDonations = donations.filter(
    d => d.assignedVolunteerId === volunteer?.id || d.assignedVolunteerName === volunteer?.name
  );

  const filtered = volunteerDonations.filter(d => {
    if (filter === 'COMPLETED') return d.status === DONATION_STATUS.COMPLETED;
    if (filter === 'ACTIVE') return d.status !== DONATION_STATUS.COMPLETED;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Rescue Mission History</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          All food deliveries and emergency rescue assignments for {volunteer?.name || 'you'}.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
        {[
          { id: 'ALL', label: `All Missions (${volunteerDonations.length})` },
          { id: 'COMPLETED', label: 'Delivered' },
          { id: 'ACTIVE', label: 'In Progress' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: filter === tab.id ? 'var(--brand-500)' : 'transparent',
              color: filter === tab.id ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div className="as-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <Bike size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto var(--space-3)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>No Missions Found</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Completed food rescues and distributions will be cataloged here.
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="as-card as-card-interactive"
              onClick={() => onSelectDonation && onSelectDonation(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-600)' }}>
                  Rescue #{item.publicReference}
                </span>
                <StatusChip status={item.status} />
              </div>

              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {item.quantityMeals} Meals • {item.foodDescription}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    From: {item.pickupAddress}
                  </span>
                </div>
                {item.destinationName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--status-success-solid)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      To: {item.destinationName}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--brand-600)', fontWeight: 600 }}>
                  Inspect Rescue Details <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
