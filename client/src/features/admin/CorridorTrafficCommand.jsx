import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { StatusChip } from '../../components/common/StatusChip';
import { Modal } from '../../components/common/Modal';
import { DONATION_STATUS } from '../../constants/donationStatus';
import {
  Route,
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Bike,
  Truck,
  Clock,
  Radio,
  Zap,
  Phone,
  Send,
  MapPin,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Building,
  Map as MapIcon,
  Layers
} from 'lucide-react';
import { LiveVolunteerRouteMap } from './LiveVolunteerRouteMap';

const INITIAL_CORRIDORS = [
  {
    id: 'corridor-01',
    name: 'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board',
    shortName: 'Central-East Tech Artery',
    lengthKm: 11.4,
    trafficLevel: 'LOW', // 'LOW' | 'MODERATE' | 'HIGH'
    trafficStatusText: 'Optimal Flow • Green Transit Corridor',
    typicalDelayMins: 4,
    keyWaypoints: ['Indiranagar 100ft Rd', 'Domlur Flyover', 'Sony World Signal', 'Silk Board Jn'],
    recommendedTransport: 'Two-Wheeler (Agile Insulated Crate)',
    transportReason: 'Cuts through evening Silk Board & Sony World signal queues without stall.',
    bypassRouteName: 'Inner Ring Rd via 80ft Road Link',
    assignedVolunteerNames: ['Aarav Patel', 'Rohan Joshi'],
    hotspotInfo: 'Silk Board junction bottleneck between 6:30 PM – 8:00 PM peak.',
    searchKeywords: ['indiranagar', 'domlur', 'koramangala', 'silk board', 'ring rd', 'bda']
  },
  {
    id: 'corridor-02',
    name: 'Whitefield ➔ Marathahalli ➔ Bellandur ➔ Sarjapur Rd',
    shortName: 'Eastern IT & Outer Ring Corridor',
    lengthKm: 14.8,
    trafficLevel: 'MODERATE',
    trafficStatusText: 'Moderate Peak • Outer Ring Road Volume',
    typicalDelayMins: 14,
    keyWaypoints: ['ITPL Main Gate', 'Hope Farm Jn', 'Marathahalli Underpass', 'Bellandur EcoSpace'],
    recommendedTransport: 'Four-Wheeler / Utility Van',
    transportReason: 'Required for high-volume corporate tech park cafeterias (>150 meals bulk).',
    bypassRouteName: 'Varthur Kodi Rd bypass avoiding Marathahalli flyover',
    assignedVolunteerNames: ['Priya Nair', 'Meera Iyer'],
    hotspotInfo: 'Marathahalli bridge & Bellandur EcoSpace exit merge points.',
    searchKeywords: ['whitefield', 'marathahalli', 'bellandur', 'sarjapur', 'itpl']
  },
  {
    id: 'corridor-03',
    name: 'Shivaji Nagar ➔ Frazer Town ➔ MG Road ➔ Ulsoor',
    shortName: 'Central Heritage Corridor',
    lengthKm: 7.2,
    trafficLevel: 'LOW',
    trafficStatusText: 'Fast Clearance • Steady Transit',
    typicalDelayMins: 3,
    keyWaypoints: ['Shivaji Nagar Bus Stand', 'Coles Park', 'MG Road Metro', 'Ulsoor Gurudwara'],
    recommendedTransport: 'Two-Wheeler or Utility Van',
    transportReason: 'Narrow commercial alleys; two-wheelers navigate market entries faster.',
    bypassRouteName: 'Cubbon Road straight link to Halasuru',
    assignedVolunteerNames: ['Vikram Joshi'],
    hotspotInfo: 'Shivaji Nagar market entrance pedestrian crossings.',
    searchKeywords: ['shivaji', 'frazer', 'mg road', 'ulsoor', 'cantonment']
  },
  {
    id: 'corridor-04',
    name: 'Jayanagar ➔ JP Nagar ➔ Banashankari ➔ Kanakapura Rd',
    shortName: 'South Bengaluru Metro Artery',
    lengthKm: 9.6,
    trafficLevel: 'LOW',
    trafficStatusText: 'Smooth Transit • Elevated Metro Corridor',
    typicalDelayMins: 5,
    keyWaypoints: ['Jayanagar 4th Block', 'JP Nagar 15th Cross', 'Banashankari Temple', 'Sarakki Jn'],
    recommendedTransport: 'Two-Wheeler or Four-Wheeler',
    transportReason: 'Wide arterial avenues; suitable for mixed vehicle dispatch.',
    bypassRouteName: 'Ring Road underpass straight link',
    assignedVolunteerNames: ['Kavita Menon'],
    hotspotInfo: 'Sarakki junction right-turn peak queue.',
    searchKeywords: ['jayanagar', 'jp nagar', 'banashankari', 'kanakapura']
  }
];

export const CorridorTrafficCommand = ({
  donations = [],
  volunteers = [],
  onRerouteMission,
  onBroadcastAdvisory
}) => {
  const [corridors, setCorridors] = useState(INITIAL_CORRIDORS);
  const [simulatedJamCorridorId, setSimulatedJamCorridorId] = useState(null);
  const [selectedCorridorForAdvisory, setSelectedCorridorForAdvisory] = useState(null);
  const [advisoryMessage, setAdvisoryMessage] = useState('');
  const [rerouteSuccessMessage, setRerouteSuccessMessage] = useState('');
  const [activeView, setActiveView] = useState('MAP'); // 'MAP' | 'CARDS' | 'SPLIT'

  // Toggle Traffic Jam Simulation for Demo & Operational Readiness
  const handleToggleSimulation = (corridorId) => {
    if (simulatedJamCorridorId === corridorId) {
      // Clear simulation
      setSimulatedJamCorridorId(null);
      setCorridors(prev =>
        prev.map(c =>
          c.id === corridorId
            ? {
                ...c,
                trafficLevel: 'LOW',
                trafficStatusText: 'Optimal Flow • Green Transit Corridor',
                typicalDelayMins: 4
              }
            : c
        )
      );
    } else {
      // Activate simulated jam
      setSimulatedJamCorridorId(corridorId);
      setCorridors(prev =>
        prev.map(c =>
          c.id === corridorId
            ? {
                ...c,
                trafficLevel: 'HIGH',
                trafficStatusText: '🚨 HEAVY CONGESTION • Peak Signal Queue Backed Up (+26 min)',
                typicalDelayMins: 28
              }
            : c
        )
      );
    }
  };

  // Execute Detour Bypass for active missions on that corridor
  const handleExecuteDetour = (corridor) => {
    // Find active donations matching this corridor
    const matchedDonations = donations.filter(d => {
      const addr = (d.pickupAddress || '').toLowerCase();
      return corridor.searchKeywords.some(kw => addr.includes(kw));
    });

    const activeDonation = matchedDonations.find(
      d =>
        d.status === DONATION_STATUS.ACCEPTED ||
        d.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP ||
        d.status === DONATION_STATUS.PICKED_UP ||
        d.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS ||
        d.status === DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE
    ) || matchedDonations[0] || donations[0];

    if (activeDonation && onRerouteMission) {
      const note = `Admin Traffic Command: Activated detour via ${corridor.bypassRouteName} to bypass congestion on ${corridor.name}. Saves est. 16 mins transit time.`;
      onRerouteMission(activeDonation.id, note, corridor.bypassRouteName);
      setRerouteSuccessMessage(`✓ Detour Bypass Activated for #${activeDonation.publicReference}: Diverted via ${corridor.bypassRouteName}. Courier notified via push alert.`);
      setTimeout(() => setRerouteSuccessMessage(''), 7000);
    }
  };

  // Send Broadcast Advisory
  const handleSendAdvisory = () => {
    if (!advisoryMessage.trim()) return;
    if (onBroadcastAdvisory && selectedCorridorForAdvisory) {
      onBroadcastAdvisory(selectedCorridorForAdvisory.name, advisoryMessage);
      setRerouteSuccessMessage(`✓ Broadcast Advisory sent to all volunteers on ${selectedCorridorForAdvisory.shortName}!`);
      setTimeout(() => setRerouteSuccessMessage(''), 5000);
    }
    setSelectedCorridorForAdvisory(null);
    setAdvisoryMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Success alert banner */}
      {rerouteSuccessMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#064e3b',
            border: '1px solid #059669',
            borderRadius: 'var(--radius-md)',
            color: '#a7f3d0',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
          <span>{rerouteSuccessMessage}</span>
        </div>
      )}

      {/* Corridor Command Header Card */}
      <div className="as-card as-card-elevated" style={{ padding: '16px 20px', borderLeft: '4px solid #3b82f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} style={{ color: '#60a5fa' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                Bengaluru Commute Corridors & City Traffic Command
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '780px', lineHeight: 1.4 }}>
              Intelligently routing food rescue along volunteers&apos; natural daily commute paths (<strong style={{ color: '#38bdf8' }}>0 km detour principle</strong>).
              Real-time traffic sensors prioritize two-wheelers for dense signal choke points and utility vans for 150+ meal bulk cafeteria batches.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* View Switcher: Map vs Cards vs Split */}
            <div style={{ display: 'inline-flex', backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-default)' }}>
              <button
                type="button"
                onClick={() => setActiveView('MAP')}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 9px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeView === 'MAP' ? 'var(--brand-500)' : 'transparent',
                  color: activeView === 'MAP' ? '#0b1120' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapIcon size={12} />
                Live Map Radar
              </button>
              <button
                type="button"
                onClick={() => setActiveView('CARDS')}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 9px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeView === 'CARDS' ? 'var(--brand-500)' : 'transparent',
                  color: activeView === 'CARDS' ? '#0b1120' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Route size={12} />
                Artery Cards
              </button>
              <button
                type="button"
                onClick={() => setActiveView('SPLIT')}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 9px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeView === 'SPLIT' ? 'var(--brand-500)' : 'transparent',
                  color: activeView === 'SPLIT' ? '#0b1120' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Layers size={12} />
                Split
              </button>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              <Radio size={12} className="animate-pulse" />
              4 ARTERIES ACTIVE
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: simulatedJamCorridorId ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                color: simulatedJamCorridorId ? '#f87171' : '#60a5fa',
                border: `1px solid ${simulatedJamCorridorId ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`,
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              {simulatedJamCorridorId ? '🚨 1 CONGESTION BOTTLENECK' : '✓ 0 TRAFFIC BOTTLENECKS'}
            </span>
          </div>
        </div>

        {/* Live Telemetry Summary Stats Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-default)'
          }}
        >
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Zero-Detour Average</span>
            <strong style={{ fontSize: '14px', color: '#f8fafc' }}>0.8 km Extra Detour</strong>
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Average Transit Speed</span>
            <strong style={{ fontSize: '14px', color: '#34d399' }}>22.4 km/h (Under 30m)</strong>
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Commuter Volunteer Pool</span>
            <strong style={{ fontSize: '14px', color: 'var(--brand-500)' }}>{volunteers.length} Annasevaks</strong>
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Vehicle Fleet Ratio</span>
            <strong style={{ fontSize: '14px', color: '#c084fc' }}>65% 2W • 35% 4W / Van</strong>
          </div>
        </div>
      </div>

      {/* LIVE RADAR MAP COMPONENT */}
      {(activeView === 'MAP' || activeView === 'SPLIT') && (
        <LiveVolunteerRouteMap
          corridors={corridors}
          donations={donations}
          volunteers={volunteers}
          simulatedJamCorridorId={simulatedJamCorridorId}
          onToggleJam={handleToggleSimulation}
          onExecuteDetour={handleExecuteDetour}
          onOpenAdvisory={(corridorId) => {
            const c = corridors.find(item => item.id === corridorId) || corridors[0];
            setSelectedCorridorForAdvisory(c);
            setAdvisoryMessage(`Traffic Advisory for ${c.shortName}: Proceed via ${c.bypassRouteName} to avoid peak signal delay.`);
          }}
        />
      )}

      {/* Corridor Cards Grid */}
      {(activeView === 'CARDS' || activeView === 'SPLIT') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
          {corridors.map(corridor => {
            const isJammed = corridor.trafficLevel === 'HIGH';
            const isModerate = corridor.trafficLevel === 'MODERATE';

          // Match active donations to this corridor
          const matchedDonations = donations.filter(d => {
            const addr = (d.pickupAddress || '').toLowerCase();
            return corridor.searchKeywords.some(kw => addr.includes(kw));
          });

          // Match registered volunteers whose preferableRoute or serviceAreas match this corridor
          const matchedVolunteers = volunteers.filter(v => {
            const route = (v.preferableRoute || '').toLowerCase();
            const areas = Array.isArray(v.serviceAreas)
              ? v.serviceAreas.join(' ').toLowerCase()
              : (v.serviceAreas || '').toLowerCase();
            return corridor.searchKeywords.some(kw => route.includes(kw) || areas.includes(kw));
          });

          return (
            <div
              key={corridor.id}
              className="as-card as-card-elevated"
              style={{
                borderLeft: isJammed
                  ? '4px solid #ef4444'
                  : isModerate
                  ? '4px solid #f59e0b'
                  : '4px solid #10b981',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px'
              }}
            >
              {/* Card Header: Route & Status */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Route size={16} style={{ color: isJammed ? '#f87171' : isModerate ? '#fbbf24' : '#34d399', flexShrink: 0 }} />
                    <strong style={{ fontSize: '13.5px', color: '#f8fafc' }}>{corridor.shortName}</strong>
                  </div>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      backgroundColor: isJammed
                        ? 'rgba(239, 68, 68, 0.2)'
                        : isModerate
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(16, 185, 129, 0.2)',
                      color: isJammed ? '#f87171' : isModerate ? '#fbbf24' : '#34d399',
                      border: `1px solid ${isJammed ? 'rgba(239, 68, 68, 0.4)' : isModerate ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                    }}
                  >
                    {isJammed ? 'CONGESTION' : isModerate ? 'MODERATE PEAK' : 'FLOWING'}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
                  {corridor.name}
                </p>
              </div>

              {/* Waypoint Trace Chips */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', fontSize: '10.5px', color: 'var(--text-tertiary)' }}>
                {corridor.keyWaypoints.map((wp, idx) => (
                  <React.Fragment key={wp}>
                    <span style={{ backgroundColor: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      {wp}
                    </span>
                    {idx < corridor.keyWaypoints.length - 1 && <span>➔</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Traffic Telemetry Bar */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isJammed ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-surface)',
                  border: `1px solid ${isJammed ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}`,
                  fontSize: '11.5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: isJammed ? '#fca5a5' : 'var(--text-secondary)' }}>
                  <span>Status: <strong>{corridor.trafficStatusText}</strong></span>
                  <span style={{ fontWeight: 700, color: isJammed ? '#f87171' : '#34d399' }}>
                    +{corridor.typicalDelayMins}m signal delay
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>
                  ⚠️ Hotspot: {corridor.hotspotInfo}
                </div>
              </div>

              {/* Recommended Transport Mode */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                {corridor.recommendedTransport.includes('Two-Wheeler') ? (
                  <Bike size={16} style={{ color: 'var(--brand-500)', flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <Truck size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
                )}
                <div>
                  <strong style={{ color: '#f8fafc' }}>Optimal Fleet Mode: {corridor.recommendedTransport}</strong>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    {corridor.transportReason}
                  </div>
                </div>
              </div>

              {/* Assigned Commuters & Online Volunteers */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Commuting Annasevaks on Path ({matchedVolunteers.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matchedVolunteers.length > 0 ? (
                    matchedVolunteers.map(vol => (
                      <span
                        key={vol.id}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-default)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: vol.isAvailable ? '#22c55e' : '#94a3b8' }} />
                        <strong>{vol.name}</strong> ({vol.transportType.split('(')[0].trim()})
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                      No volunteers currently commute this path
                    </span>
                  )}
                </div>
              </div>

              {/* Active Rescues Along this Corridor */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Active Food Rescues in Transit ({matchedDonations.length})
                </span>
                {matchedDonations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {matchedDonations.slice(0, 2).map(donation => (
                      <div
                        key={donation.id}
                        style={{
                          padding: '6px 8px',
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11px'
                        }}
                      >
                        <div>
                          <strong style={{ color: '#f8fafc' }}>#{donation.publicReference}</strong> • {donation.quantityMeals} Meals
                          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                            {donation.foodDescription}
                          </div>
                        </div>
                        <StatusChip status={donation.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> Corridor free of pending surplus
                  </div>
                )}
              </div>

              {/* Action Buttons for Admin Traffic Control */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '8px' }}>
                {/* 1. Detour Reroute Button (Highlight if jammed) */}
                <Button
                  variant={isJammed ? 'primary' : 'outline'}
                  size="sm"
                  icon={Zap}
                  onClick={() => handleExecuteDetour(corridor)}
                  title={`Execute Detour Bypass via ${corridor.bypassRouteName}`}
                >
                  {isJammed ? '⚡ Deploy Bypass Reroute' : 'Bypass Route'}
                </Button>

                {/* 2. Broadcast Advisory */}
                <Button
                  variant="outline"
                  size="sm"
                  icon={Send}
                  onClick={() => {
                    setSelectedCorridorForAdvisory(corridor);
                    setAdvisoryMessage(`Traffic Advisory for ${corridor.shortName}: Proceed via ${corridor.bypassRouteName} to avoid peak signal delay.`);
                  }}
                >
                  Advisory
                </Button>

                {/* 3. Simulate Jam / Reset */}
                <button
                  onClick={() => handleToggleSimulation(corridor.id)}
                  style={{
                    marginLeft: 'auto',
                    background: 'transparent',
                    border: '1px dashed var(--border-default)',
                    color: isJammed ? '#f87171' : 'var(--text-tertiary)',
                    fontSize: '10.5px',
                    padding: '3px 7px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  title="Toggle peak traffic simulation for testing dispatch resilience"
                >
                  {isJammed ? '🟢 Clear Jam' : '🚨 Simulate Jam'}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* MODAL: Broadcast Traffic Advisory */}
      {selectedCorridorForAdvisory && (
        <Modal
          isOpen={Boolean(selectedCorridorForAdvisory)}
          onClose={() => setSelectedCorridorForAdvisory(null)}
          title="Broadcast Corridor Traffic Advisory"
          subtitle={`Sending high-priority navigation alert to Annasevaks on ${selectedCorridorForAdvisory.name}`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Select Preset Traffic Alert or Write Custom:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                {[
                  `⚠️ Rain slowdown along ${selectedCorridorForAdvisory.shortName}: Please maintain insulated waterproof covers.`,
                  `🚧 Heavy peak congestion near ${selectedCorridorForAdvisory.keyWaypoints[2]}: Divert via ${selectedCorridorForAdvisory.bypassRouteName}.`,
                  `⚡ Urgent surplus rescue dispatched on your route: Accept offer within 15 minutes to guarantee food freshness.`
                ].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAdvisoryMessage(preset)}
                    style={{
                      textAlign: 'left',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: advisoryMessage === preset ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-surface)',
                      border: `1px solid ${advisoryMessage === preset ? 'var(--brand-500)' : 'var(--border-subtle)'}`,
                      color: advisoryMessage === preset ? 'var(--brand-500)' : 'var(--text-secondary)',
                      fontSize: '11.5px',
                      cursor: 'pointer'
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={advisoryMessage}
                onChange={(e) => setAdvisoryMessage(e.target.value)}
                placeholder="Type real-time commute alert to volunteers on this corridor..."
                style={{ width: '100%', fontSize: '12px', padding: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="outline" size="sm" onClick={() => setSelectedCorridorForAdvisory(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={Send} onClick={handleSendAdvisory}>
                Send Advisory Broadcast
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
