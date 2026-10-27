import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Bike,
  Truck,
  Building,
  Utensils,
  Radio,
  Clock,
  Compass,
  CheckCircle2,
  Zap,
  Phone
} from 'lucide-react';

export const AreaDispatchMap = ({
  donation,
  destination,
  volunteers = [],
  selectedVolunteerId,
  onSelectVolunteer
}) => {
  const [hoveredEntity, setHoveredEntity] = useState(null);

  if (!donation) return null;

  // Donor Pickup Coordinates (Center of the local tactical map: Width 700, Height 260)
  const pickupNode = {
    x: 320,
    y: 130,
    name: donation.pickupAddress || 'Donor Pickup Premises',
    landmark: donation.pickupLandmark || 'Main Gate',
    meals: donation.quantityMeals || 50,
    ref: donation.publicReference || 'AS-101'
  };

  // Destination Shelter Node (Positioned East/Southeast of pickup)
  const destNode = {
    x: 540,
    y: 170,
    name: destination?.name || 'Pragati Shelter Kitchen',
    capacity: destination?.capacityMeals || 250
  };

  // Plot Volunteers around the area relative to pickup
  // Filter for verified volunteers or fallback to all available volunteers
  const verifiedList = volunteers.filter(v => v.status === 'VERIFIED_ACTIVE');
  const targetList = verifiedList.length > 0 ? verifiedList : volunteers;

  const volunteerNodes = targetList.map((vol, index) => {
    // Deterministic layout offsets around the pickup point
    const angle = (index * 1.5) + 0.8;
    const radius = 90 + (index * 45);
    const x = Math.max(70, Math.min(630, pickupNode.x + Math.cos(angle) * radius));
    const y = Math.max(45, Math.min(225, pickupNode.y + Math.sin(angle) * (radius * 0.75)));

    const isTwoWheeler = (vol.transportType || '').toLowerCase().includes('two') || (vol.transportType || '').toLowerCase().includes('bike');
    const isSelected = vol.id === selectedVolunteerId;
    const isOnline = Boolean(vol.isAvailable);

      // Approximate distance calculation
      const distKm = (1.2 + (index * 1.6)).toFixed(1);
      const etaMins = Math.max(6, Math.round(Number(distKm) * (isTwoWheeler ? 4 : 5.5)));

      return {
        id: vol.id,
        name: vol.name,
        phone: vol.phone || '+91 98000 00000',
        transportType: vol.transportType || 'Two-Wheeler',
        isTwoWheeler,
        isOnline,
        isSelected,
        x,
        y,
        distKm,
        etaMins,
        corridor: vol.preferableRoute || 'Central Arterial Corridor'
      };
    });

  const selectedVol = volunteerNodes.find(v => v.isSelected) || volunteerNodes[0];

  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid #1e293b',
        backgroundColor: '#0a0f1d',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)'
      }}
    >
      {/* Map Header Toolbar */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={15} style={{ color: '#38bdf8' }} />
          <strong style={{ fontSize: '11.5px', color: '#f8fafc' }}>
            Live Area Dispatch Radar • Volunteer Proximity Tracking
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10.5px' }}>
          <span style={{ color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} className="animate-pulse" />
            {volunteerNodes.filter(v => v.isOnline).length} Active Couriers in Area
          </span>
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>
            Click courier pin to select
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div style={{ position: 'relative', width: '100%', height: '210px', backgroundColor: '#090d1a' }}>
        <svg
          viewBox="0 0 700 260"
          style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
        >
          <defs>
            <pattern id="radarGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255, 255, 255, 0.035)" strokeWidth="1" />
            </pattern>

            <filter id="areaGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="areaGlowAmber" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Tactical Background Grid */}
          <rect width="700" height="260" fill="url(#radarGrid)" />

          {/* Range rings centered at Donor Pickup */}
          <circle cx={pickupNode.x} cy={pickupNode.y} r="70" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
          <circle cx={pickupNode.x} cy={pickupNode.y} r="140" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" strokeDasharray="3 4" />
          <text x={pickupNode.x + 75} y={pickupNode.y - 6} fill="#475569" fontSize="9" fontWeight="600">2 km radius</text>
          <text x={pickupNode.x + 145} y={pickupNode.y - 6} fill="#475569" fontSize="9" fontWeight="600">4 km radius</text>

          {/* ================= ROUTE CONNECTOR LINES ================= */}
          {/* Path from selected volunteer -> pickup -> destination */}
          {selectedVol && (
            <g>
              {/* Courier to Pickup leg */}
              <line
                x1={selectedVol.x}
                y1={selectedVol.y}
                x2={pickupNode.x}
                y2={pickupNode.y}
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                filter="url(#areaGlowCyan)"
                opacity="0.8"
              />

              {/* Pickup to Destination leg */}
              <line
                x1={pickupNode.x}
                y1={pickupNode.y}
                x2={destNode.x}
                y2={destNode.y}
                stroke="#10b981"
                strokeWidth="3"
                opacity="0.75"
              />
            </g>
          )}

          {/* ================= 1. DESTINATION SHELTER PIN ================= */}
          <g transform={`translate(${destNode.x}, ${destNode.y})`}>
            <circle r="14" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />
            <circle r="5" fill="#10b981" />
            <rect x="12" y="-11" width="130" height="18" rx="3" fill="rgba(15, 23, 42, 0.85)" stroke="#059669" strokeWidth="0.8" />
            <text x="16" y="2" fill="#a7f3d0" fontSize="9.5" fontWeight="700">
              🏠 {destNode.name.split('(')[0].trim()}
            </text>
          </g>

          {/* ================= 2. DONOR FOOD PICKUP PIN ================= */}
          <g transform={`translate(${pickupNode.x}, ${pickupNode.y})`}>
            {/* Pulsing beacon */}
            <circle r="20" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="animate-pulse" opacity="0.6" />
            <circle r="13" fill="rgba(245, 158, 11, 0.3)" stroke="#fbbf24" strokeWidth="1.5" filter="url(#areaGlowAmber)" />
            <circle r="5" fill="#f59e0b" />
            <rect x="12" y="-12" width="125" height="20" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" strokeWidth="1" />
            <text x="16" y="2" fill="#fbbf24" fontSize="10" fontWeight="800">
              🍲 PICKUP (#{pickupNode.ref})
            </text>
          </g>

          {/* ================= 3. VOLUNTEER COURIER PINS ================= */}
          {volunteerNodes.map(vol => {
            return (
              <g
                key={vol.id}
                transform={`translate(${vol.x}, ${vol.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectVolunteer && onSelectVolunteer(vol.id)}
                onMouseEnter={() => setHoveredEntity(vol)}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                {/* Active Selection Halo */}
                {vol.isSelected && (
                  <circle
                    r="22"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                  />
                )}

                {/* Base Courier Halo */}
                <circle
                  r={vol.isSelected ? 14 : 10}
                  fill={vol.isSelected ? 'rgba(56, 189, 248, 0.35)' : vol.isOnline ? 'rgba(34, 197, 94, 0.25)' : 'rgba(148, 163, 184, 0.2)'}
                  stroke={vol.isSelected ? '#38bdf8' : vol.isOnline ? '#22c55e' : '#64748b'}
                  strokeWidth={vol.isSelected ? 2 : 1.5}
                />

                <circle r={vol.isSelected ? 4.5 : 3.5} fill={vol.isSelected ? '#38bdf8' : vol.isOnline ? '#22c55e' : '#94a3b8'} />

                {/* Courier Badge Text */}
                <rect
                  x="12"
                  y="-11"
                  width={vol.name.length * 6.5 + 46}
                  height="19"
                  rx="3"
                  fill={vol.isSelected ? 'rgba(14, 165, 233, 0.25)' : 'rgba(15, 23, 42, 0.85)'}
                  stroke={vol.isSelected ? '#38bdf8' : vol.isOnline ? '#1e293b' : '#334155'}
                  strokeWidth="1"
                />

                <text x="16" y="2" fill={vol.isSelected ? '#38bdf8' : '#f8fafc'} fontSize="9.5" fontWeight={vol.isSelected ? '800' : '600'}>
                  {vol.isTwoWheeler ? '🏍️' : '🚐'} {vol.name} • {vol.distKm}km
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Proximity Inspector Tag on bottom of map */}
        {selectedVol && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '10px',
              right: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
              fontSize: '11px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={13} style={{ color: '#38bdf8' }} />
              <span>
                Selected Courier: <strong style={{ color: '#f8fafc' }}>{selectedVol.name}</strong> ({selectedVol.transportType})
              </span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>
                • {selectedVol.distKm} km from pickup (~{selectedVol.etaMins}m ETA)
              </span>
            </div>

            <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
              Corridor: {selectedVol.corridor.split('➔')[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
