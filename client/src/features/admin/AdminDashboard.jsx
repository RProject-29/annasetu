import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { StatusChip } from '../../components/common/StatusChip';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { DonationReviewModal } from './DonationReviewModal';
import { ProofReviewModal } from './ProofReviewModal';
import { VolunteerVerificationModal } from './VolunteerVerificationModal';
import { AddDestinationModal } from './AddDestinationModal';
import { CorridorTrafficCommand } from './CorridorTrafficCommand';
import { LiveVolunteerRouteMap } from './LiveVolunteerRouteMap';
import { storageService } from '../../services/storageService';
import { DONATION_STATUS } from '../../constants/donationStatus';
import { VOLUNTEER_STATUS, ROLES } from '../../constants/roles';
import {
  TrendingUp,
  Activity,
  Plus,
  Eye,
  Smartphone,
  UserCheck,
  Search,
  CheckCircle2,
  Compass,
  Route,
  Navigation,
  Radio,
  Phone,
  ShieldCheck,
  Building,
  Map as MapIcon,
  Layers
} from 'lucide-react';

export const AdminDashboard = ({
  donations = [],
  destinations = [],
  volunteers = [],
  onUpdateDonationStatus,
  onUpdateVolunteerStatus,
  onAddDestination,
  onNavigateApp
}) => {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | UNREVIEWED | ACTIVE | PROOFS | CORRIDORS | VOLUNTEERS | DESTINATIONS
  const [ledgerViewMode, setLedgerViewMode] = useState('TABLE'); // 'TABLE' | 'RADAR'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [reviewingDonation, setReviewingDonation] = useState(null);
  const [reviewingProof, setReviewingProof] = useState(null);
  const [verifyingVolunteer, setVerifyingVolunteer] = useState(null);
  const [isAddDestModalOpen, setIsAddDestModalOpen] = useState(false);


  // Queues & Counters
  const unreviewed = donations.filter(d => d.status === DONATION_STATUS.SUBMITTED || d.status === DONATION_STATUS.UNDER_REVIEW);
  const awaitingOffers = donations.filter(d => d.status === DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE);
  const activeOps = donations.filter(d =>
    d.status === DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE ||
    d.status === DONATION_STATUS.ACCEPTED ||
    d.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP ||
    d.status === DONATION_STATUS.PICKED_UP ||
    d.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS
  );
  const proofsAwaiting = donations.filter(d => d.status === DONATION_STATUS.PROOF_SUBMITTED);
  const pendingVolunteers = volunteers.filter(v => v.status === VOLUNTEER_STATUS.PENDING);
  const completedRescues = donations.filter(d => d.status === DONATION_STATUS.COMPLETED);
  const totalMealsDelivered = completedRescues.reduce((acc, d) => acc + (Number(d.quantityMeals) || 0), 0);

  // Search filter
  const filterList = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(item =>
      (item.foodDescription && item.foodDescription.toLowerCase().includes(q)) ||
      (item.publicReference && item.publicReference.toLowerCase().includes(q)) ||
      (item.donorName && item.donorName.toLowerCase().includes(q)) ||
      (item.name && item.name.toLowerCase().includes(q))
    );
  };

  // Database & Backend Status
  const [backendStatus, setBackendStatus] = useState(storageService.getBackendStatus());

  useEffect(() => {
    setBackendStatus(storageService.getBackendStatus());
    const handleStateChange = () => {
      setBackendStatus(storageService.getBackendStatus());
    };
    window.addEventListener('annasetu:stateChange', handleStateChange);
    return () => window.removeEventListener('annasetu:stateChange', handleStateChange);
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Top Welcome & Operational Command Header */}
      <div className="admin-top-bar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800 }}>AnnaSetu Operations</h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap'
              }}
            >
              ADMIN PORTAL
            </span>

            {/* Live Database & Server Status Indicator */}
            {backendStatus && backendStatus.status === 'ONLINE' ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} className="animate-pulse" />
                DB: {backendStatus.databaseMode === 'MONGODB' ? 'MongoDB Atlas' : 'Local DB Active (:5000)'}
              </span>
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap'
                }}
              >
                DB: Ready (:5000)
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Supervise food reports, match volunteers, monitor timelines, and verify distribution proof.
          </p>
        </div>

        {/* Global Impact Summary */}
        <div className="admin-impact-cards">
          <div className="as-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <TrendingUp size={18} style={{ color: 'var(--brand-500)' }} />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Total Rescued</span>
              <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{totalMealsDelivered} Meals</strong>
            </div>
          </div>

          <div className="as-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Activity size={18} style={{ color: 'var(--status-success-solid)' }} />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Completed</span>
              <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{completedRescues.length} Rescues</strong>
            </div>
          </div>

          {onNavigateApp && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <Button
                variant="outline"
                size="sm"
                icon={Smartphone}
                onClick={onNavigateApp}
                title="Open Mobile Community App"
              >
                Open Mobile App
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Urgent Operational Queues Metric Bar */}
      <div className="admin-metrics-grid">
        {/* Queue 1: Unreviewed */}
        <div
          className="as-card as-card-interactive"
          onClick={() => setActiveTab('UNREVIEWED')}
          style={{
            borderLeft: unreviewed.length > 0 ? '4px solid var(--status-urgent-solid)' : '1px solid var(--border-default)',
            backgroundColor: activeTab === 'UNREVIEWED' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pending Reports</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: unreviewed.length > 0 ? 'var(--status-urgent-text)' : 'var(--text-primary)' }}>
              {unreviewed.length}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Needs admin review
          </p>
        </div>

        {/* Queue 2: Active Rescues */}
        <div
          className="as-card as-card-interactive"
          onClick={() => setActiveTab('ACTIVE')}
          style={{
            borderLeft: activeOps.length > 0 ? '4px solid var(--status-info-solid)' : '1px solid var(--border-default)',
            backgroundColor: activeTab === 'ACTIVE' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Active & Confirmed</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#60a5fa' }}>
              {activeOps.length}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            {awaitingOffers.length > 0 ? `${awaitingOffers.length} offered • ` : ''}Confirmed & in transit
          </p>
        </div>

        {/* Queue 3: Proofs for Review */}
        <div
          className="as-card as-card-interactive"
          onClick={() => setActiveTab('PROOFS')}
          style={{
            borderLeft: proofsAwaiting.length > 0 ? '4px solid var(--brand-500)' : '1px solid var(--border-default)',
            backgroundColor: activeTab === 'PROOFS' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Proofs Awaiting</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-500)' }}>
              {proofsAwaiting.length}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Distribution photos
          </p>
        </div>

        {/* Queue 4: Pending Volunteers */}
        <div
          className="as-card as-card-interactive"
          onClick={() => setActiveTab('VOLUNTEERS')}
          style={{
            borderLeft: pendingVolunteers.length > 0 ? '4px solid #a855f7' : '1px solid var(--border-default)',
            backgroundColor: activeTab === 'VOLUNTEERS' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pending Volunteers</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#c084fc' }}>
              {pendingVolunteers.length}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            ID verification queue
          </p>
        </div>

        {/* Queue 5: Corridors & Traffic Command */}
        <div
          className="as-card as-card-interactive"
          onClick={() => setActiveTab('CORRIDORS')}
          style={{
            borderLeft: '4px solid #38bdf8',
            backgroundColor: activeTab === 'CORRIDORS' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>🗺️ Live Map & Fleet</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', whiteSpace: 'nowrap' }}>
              4 Flowing
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', whiteSpace: 'nowrap' }}>
            Live GPS telemetry
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-tabs">
          {[
            { id: 'ALL', label: `All (${donations.length})` },
            { id: 'UNREVIEWED', label: `Pending (${unreviewed.length})` },
            { id: 'ACTIVE', label: `Active & Confirmed (${activeOps.length})` },
            { id: 'PROOFS', label: `Proofs (${proofsAwaiting.length})` },
            { id: 'CORRIDORS', label: `🗺️ Live Map & Corridors` },
            { id: 'VOLUNTEERS', label: `Volunteers (${volunteers.length})` },
            { id: 'DESTINATIONS', label: `Destinations (${destinations.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="admin-filter-tab"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--brand-500)' : 'transparent',
                color: activeTab === tab.id ? '#0b1120' : 'var(--text-secondary)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="admin-search-wrapper">
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', zIndex: 1 }} />
          <input
            type="text"
            placeholder="Search reports or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* SECTION: CORRIDORS & CITY TRAFFIC COMMAND TAB */}
      {activeTab === 'CORRIDORS' && (
        <CorridorTrafficCommand
          donations={donations}
          volunteers={volunteers}
          onRerouteMission={(donationId, note, bypassRoute) => {
            onUpdateDonationStatus(
              donationId,
              DONATION_STATUS.DISTRIBUTION_IN_PROGRESS,
              {
                statusNote: note,
                reroutedVia: bypassRoute,
                reroutedAt: new Date().toISOString()
              },
              'Admin Traffic Command'
            );
          }}
          onBroadcastAdvisory={(corridorName, message) => {
            storageService.addNotification({
              forRole: ROLES.VOLUNTEER,
              title: `Transit Advisory: ${corridorName}`,
              message
            });
          }}
        />
      )}

      {/* SECTION: VOLUNTEERS TAB */}
      {activeTab === 'VOLUNTEERS' && (
        <div className="as-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Volunteer Roster</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {pendingVolunteers.length} awaiting verification
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Status</th>
                  <th>Transport</th>
                  <th>Coverage</th>
                  <th>Rescues</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(vol => {
                  const volActiveRescue = donations.find(
                    d => (d.assignedVolunteerId === vol.id || d.assignedVolunteerName === vol.name) &&
                         (d.status === DONATION_STATUS.ACCEPTED ||
                          d.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP ||
                          d.status === DONATION_STATUS.PICKED_UP ||
                          d.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS ||
                          d.status === DONATION_STATUS.PROOF_SUBMITTED)
                  );

                  return (
                    <tr key={vol.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{vol.name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{vol.phone}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span
                            style={{
                              padding: '2px 7px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              backgroundColor: vol.status === 'VERIFIED_ACTIVE' ? 'var(--status-success-bg)' : 'var(--status-urgent-bg)',
                              color: vol.status === 'VERIFIED_ACTIVE' ? 'var(--status-success-text)' : 'var(--status-urgent-text)',
                              border: `1px solid ${vol.status === 'VERIFIED_ACTIVE' ? 'var(--status-success-border)' : 'var(--status-urgent-border)'}`
                            }}
                          >
                            {vol.status}
                          </span>

                          {/* Real-time Duty / Availability Badge */}
                          {volActiveRescue ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '10px',
                                fontWeight: 700,
                                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                color: '#2563eb',
                                border: '1px solid rgba(59, 130, 246, 0.3)'
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2563eb' }} className="animate-pulse" />
                              Active #{volActiveRescue.publicReference}
                            </span>
                          ) : vol.isAvailable ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '10px',
                                fontWeight: 700,
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                color: '#059669',
                                border: '1px solid rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22c55e' }} className="animate-pulse" />
                              🟢 Online & Ready
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '10px',
                                color: 'var(--text-tertiary)',
                                backgroundColor: 'var(--bg-surface-elevated)',
                                border: '1px solid var(--border-default)'
                              }}
                            >
                              ⚪ Offline / Standby
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{vol.transportType}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {vol.maximumDistanceKm} km ({Array.isArray(vol.serviceAreas) ? vol.serviceAreas.join(', ') : vol.serviceAreas})
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--brand-600)', fontSize: '13px' }}>
                          {vol.completedRescues} missions
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                          {vol.rewardPoints || 100} pts • <strong style={{ color: 'var(--text-primary)' }}>{vol.tier || 'Novice'}</strong>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          {vol.status === 'PENDING' ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={UserCheck}
                              onClick={() => setVerifyingVolunteer(vol)}
                            >
                              Verify
                            </Button>
                          ) : (
                            <>
                              {/* Direct Dispatch Authority for Admin */}
                              {vol.isAvailable && !volActiveRescue && unreviewed.length > 0 && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    setReviewingDonation(unreviewed[0]);
                                  }}
                                  title="Assign pending food report to this available volunteer"
                                >
                                  ⚡ Dispatch Food
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setVerifyingVolunteer(vol)}
                              >
                                View
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: DESTINATIONS TAB */}
      {activeTab === 'DESTINATIONS' && (
        <div className="as-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Distribution Points & Shelters</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Trusted destinations for surplus food redistribution.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddDestModalOpen(true)}
            >
              Add Destination
            </Button>
          </div>

          <div className="admin-destinations-grid">
            {destinations.map(d => {
              const allocatedMeals = donations
                .filter(item => item.destinationId === d.id && item.status !== DONATION_STATUS.REJECTED && item.status !== DONATION_STATUS.CANCELLED && item.status !== DONATION_STATUS.EXPIRED)
                .reduce((sum, item) => sum + (Number(item.quantityMeals) || 0), 0);
              const maxCap = Number(d.capacityMeals) || 200;
              const fillPct = Math.min(100, Math.round((allocatedMeals / maxCap) * 100));
              const isNearCap = fillPct >= 80;
              const isModerateCap = fillPct >= 50 && fillPct < 80;

              return (
                <div key={d.id} className="as-card as-card-elevated" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{d.name}</h4>
                      <p style={{ fontSize: '11.5px', color: 'var(--brand-500)', fontWeight: 600 }}>{d.type}</p>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--status-success-text)', fontWeight: 700, backgroundColor: 'var(--status-success-bg)', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                      ACTIVE
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📍 {d.address}</p>

                  {/* Daily Intake Capacity Meter */}
                  <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Daily Intake Quota:</span>
                      <strong style={{ color: isNearCap ? '#f87171' : isModerateCap ? '#fbbf24' : '#34d399' }}>
                        {allocatedMeals} / {maxCap} Meals ({fillPct}%)
                      </strong>
                    </div>
                    {/* Capacity progress bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${fillPct}%`,
                          height: '100%',
                          backgroundColor: isNearCap ? '#ef4444' : isModerateCap ? '#f59e0b' : '#10b981',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      {isNearCap ? '⚠️ High Load: Direct next surplus batches to other shelters' : '✓ Capacity available for incoming surplus'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', flexWrap: 'wrap', gap: '4px' }}>
                    <span>Contact: {d.contactPerson}</span>
                    <a
                      href={`tel:${d.contactPhone}`}
                      style={{ color: '#60a5fa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
                    >
                      <Phone size={11} /> {d.contactPhone}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION: MAIN DONATIONS TABLE (ALL / UNREVIEWED / ACTIVE / PROOFS) */}
      {(activeTab === 'ALL' || activeTab === 'UNREVIEWED' || activeTab === 'ACTIVE' || activeTab === 'PROOFS') && (
        <div className="as-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 700 }}>
              {activeTab === 'UNREVIEWED' ? 'Reports Requiring Review' :
               activeTab === 'ACTIVE' ? 'Active In-Transit Monitoring' :
               activeTab === 'PROOFS' ? 'Distribution Proofs' :
               'Rescues Master Ledger'}
            </h3>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref & Food Details</th>
                  <th>Qty</th>
                  <th>Deadline</th>
                  <th>Pickup</th>
                  <th>Volunteer</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterList(
                  activeTab === 'UNREVIEWED' ? unreviewed :
                  activeTab === 'ACTIVE' ? activeOps :
                  activeTab === 'PROOFS' ? proofsAwaiting :
                  donations
                ).map(donation => (
                  <tr key={donation.id}>
                    {/* Food info */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {donation.foodPhoto && (
                          <img
                            src={donation.foodPhoto}
                            alt=""
                            style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                          />
                        )}
                        <div style={{ minWidth: 0 }}>
                          <strong style={{ color: '#f8fafc', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{donation.foodDescription}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                            #{donation.publicReference} • {donation.eventType}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td style={{ fontWeight: 700, color: 'var(--brand-500)', whiteSpace: 'nowrap' }}>
                      {donation.quantityMeals} Meals
                    </td>

                    {/* Deadline */}
                    <td>
                      {donation.safeConsumptionDeadline && (
                        <CountdownTimer targetTime={donation.safeConsumptionDeadline} compact />
                      )}
                    </td>

                    {/* Pickup Address */}
                    <td style={{ maxWidth: '160px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {donation.pickupAddress}
                      </div>
                    </td>

                    {/* Assigned Volunteer */}
                    <td>
                      {donation.assignedVolunteerName ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {donation.assignedVolunteerName}
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <StatusChip status={donation.status} />
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      {donation.status === DONATION_STATUS.SUBMITTED || donation.status === DONATION_STATUS.UNDER_REVIEW ? (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={UserCheck}
                          onClick={() => setReviewingDonation(donation)}
                        >
                          Review
                        </Button>
                      ) : donation.status === DONATION_STATUS.PROOF_SUBMITTED ? (
                        <Button
                          variant="success"
                          size="sm"
                          icon={CheckCircle2}
                          onClick={() => setReviewingProof(donation)}
                        >
                          Verify
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => setReviewingDonation(donation)}
                        >
                          Inspect
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filterList(
                  activeTab === 'UNREVIEWED' ? unreviewed :
                  activeTab === 'ACTIVE' ? activeOps :
                  activeTab === 'PROOFS' ? proofsAwaiting :
                  donations
                ).length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-tertiary)' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        No reports found in this view
                      </p>
                      <p style={{ fontSize: '12px', marginTop: '6px', maxWidth: '420px', margin: '6px auto 0', lineHeight: 1.5 }}>
                        {activeTab === 'UNREVIEWED'
                          ? 'All pending reports have been reviewed! When a volunteer accepts an order, check "Active & Confirmed" or "All".'
                          : activeTab === 'ACTIVE'
                          ? 'No active rescues currently in progress. Dispatch a report from "Pending" or view "All".'
                          : 'No matching items. Try switching to the "All" tab or clearing the search.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Donation Review & Dispatch */}
      <DonationReviewModal
        isOpen={Boolean(reviewingDonation)}
        onClose={() => setReviewingDonation(null)}
        donation={reviewingDonation}
        destinations={destinations}
        volunteers={volunteers}
        onApproveAndAssign={(id, meta) => {
          onUpdateDonationStatus(id, DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE, meta, 'Admin');
          setReviewingDonation(null);
        }}
        onReject={(id) => {
          onUpdateDonationStatus(id, DONATION_STATUS.REJECTED, { statusNote: 'Admin rejected report due to food safety/timing constraints.' }, 'Admin');
          setReviewingDonation(null);
        }}
      />

      {/* MODAL 2: Distribution Proof Review */}
      <ProofReviewModal
        isOpen={Boolean(reviewingProof)}
        onClose={() => setReviewingProof(null)}
        donation={reviewingProof}
        onCompleteRescue={(id, note) => {
          onUpdateDonationStatus(id, DONATION_STATUS.COMPLETED, {
            completedAt: new Date().toISOString(),
            statusNote: note
          }, 'Admin');
        }}
        onRequestClarification={(id, note) => {
          onUpdateDonationStatus(id, DONATION_STATUS.CLARIFICATION_REQUIRED, { statusNote: note }, 'Admin');
        }}
      />

      {/* MODAL 3: Volunteer Verification */}
      <VolunteerVerificationModal
        isOpen={Boolean(verifyingVolunteer)}
        onClose={() => setVerifyingVolunteer(null)}
        volunteer={verifyingVolunteer}
        onApprove={(id, notes) => {
          onUpdateVolunteerStatus(id, VOLUNTEER_STATUS.VERIFIED_ACTIVE, notes);
        }}
        onReject={(id, notes) => {
          onUpdateVolunteerStatus(id, VOLUNTEER_STATUS.REJECTED, notes);
        }}
      />

      {/* MODAL 4: Add Destination Point */}
      <AddDestinationModal
        isOpen={isAddDestModalOpen}
        onClose={() => setIsAddDestModalOpen(false)}
        onAddDestination={(dest) => {
          onAddDestination(dest);
        }}
      />
    </div>
  );
};
