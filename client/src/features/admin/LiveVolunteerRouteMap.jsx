import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  Route,
  Compass,
  Bike,
  Truck,
  Car,
  Radio,
  Zap,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Building,
  Utensils,
  Eye,
  RefreshCw,
  Send,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DONATION_STATUS } from '../../constants/donationStatus';

// Bengaluru Geo Coordinates normalized for high-fidelity SVG Tactical Command Canvas (Width 1000, Height 640)
// Center ~ Indiranagar / MG Road
export const MAP_NODES = {
  // Corridors & Waypoints
  indiranagar: { id: 'indiranagar', name: 'Indiranagar (100ft Rd)', x: 420, y: 220, zone: 'Central-East' },
  domlur: { id: 'domlur', name: 'Domlur Flyover', x: 440, y: 280, zone: 'Central-East' },
  koramangala: { id: 'koramangala', name: 'Koramangala (Sony World)', x: 460, y: 360, zone: 'South-East' },
  silkBoard: { id: 'silkBoard', name: 'Silk Board Junction', x: 480, y: 460, zone: 'South' },

  whitefield: { id: 'whitefield', name: 'Whitefield (ITPL)', x: 880, y: 190, zone: 'East' },
  marathahalli: { id: 'marathahalli', name: 'Marathahalli Underpass', x: 740, y: 270, zone: 'East' },
  bellandur: { id: 'bellandur', name: 'Bellandur EcoSpace', x: 680, y: 370, zone: 'South-East Outer' },
  sarjapur: { id: 'sarjapur', name: 'Sarjapur Rd Junction', x: 660, y: 480, zone: 'South-East' },

  shivajiNagar: { id: 'shivajiNagar', name: 'Shivaji Nagar Bus Stand', x: 280, y: 160, zone: 'North-Central' },
  frazerTown: { id: 'frazerTown', name: 'Frazer Town / Coles Park', x: 330, y: 110, zone: 'North' },
  mgRoad: { id: 'mgRoad', name: 'MG Road Metro', x: 340, y: 220, zone: 'Central' },
  ulsoor: { id: 'ulsoor', name: 'Ulsoor Gurudwara', x: 390, y: 180, zone: 'Central-East' },

  jayanagar: { id: 'jayanagar', name: 'Jayanagar 4th Block', x: 260, y: 390, zone: 'South' },
  jpNagar: { id: 'jpNagar', name: 'JP Nagar 15th Cross', x: 280, y: 470, zone: 'South' },
  banashankari: { id: 'banashankari', name: 'Banashankari Temple', x: 220, y: 530, zone: 'South-West' },
  kanakapura: { id: 'kanakapura', name: 'Kanakapura Rd Link', x: 190, y: 600, zone: 'South-West' },

  // Bypass detour waypoints
  innerRingDetour: { id: 'innerRingDetour', name: '80ft Road Inner Link (Bypass)', x: 520, y: 320, zone: 'Detour' },
  varthurDetour: { id: 'varthurDetour', name: 'Varthur Kodi Bypass', x: 800, y: 340, zone: 'Detour' }
};

export const LiveVolunteerRouteMap = ({
  corridors = [],
  donations = [],
  volunteers = [],
  simulatedJamCorridorId,
  onToggleJam,
  onExecuteDetour,
  onOpenAdvisory
}) => {
  const [selectedEntity, setSelectedEntity] = useState(null); // { type: 'volunteer' | 'donation' | 'corridor' | 'destination', data: ... }
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'ACTIVE_ONLY' | 'CONGESTED'
  const [layerVisibility, setLayerVisibility] = useState({
    volunteers: true,
    routes: true,
    pickups: true,
    destinations: true
  });

  // Calculate dynamic coordinates and telemetry for volunteers based on real-time props
  const volunteerPins = volunteers.map((vol, idx) => {
    // Find active rescue for this volunteer
    const activeRescue = donations.find(
      d => (d.assignedVolunteerId === vol.id || d.assignedVolunteerName === vol.name) &&
           (d.status === DONATION_STATUS.ACCEPTED ||
            d.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP ||
            d.status === DONATION_STATUS.PICKED_UP ||
            d.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS ||
            d.status === DONATION_STATUS.PROOF_SUBMITTED)
    );

    // Dynamic map coordinates based on their corridor and route preferences
    let defaultX = 430;
    let defaultY = 250;
    let corridorId = 'corridor-01';
    let corridorName = 'Indiranagar ➔ Domlur ➔ Silk Board';

    const routeStr = (vol.preferableRoute || '').toLowerCase();
    if (routeStr.includes('whitefield') || routeStr.includes('marathahalli')) {
      defaultX = 770;
      defaultY = 250;
      corridorId = 'corridor-02';
      corridorName = 'Whitefield ➔ Marathahalli ➔ Bellandur';
    } else if (routeStr.includes('shivaji') || routeStr.includes('frazer') || routeStr.includes('mg road')) {
      defaultX = 320;
      defaultY = 190;
      corridorId = 'corridor-03';
      corridorName = 'Shivaji Nagar ➔ Frazer Town ➔ MG Road';
    } else if (routeStr.includes('jayanagar') || routeStr.includes('jp nagar')) {
      defaultX = 250;
      defaultY = 460;
      corridorId = 'corridor-04';
      corridorName = 'Jayanagar ➔ JP Nagar ➔ Banashankari';
    } else {
      defaultX = 420 + ((idx % 4) * 35);
      defaultY = 240 + ((idx % 4) * 25);
    }

    const isAvailable = Boolean(vol.isAvailable);
    let statusText = isAvailable ? 'ONLINE_AVAILABLE' : 'OFFLINE_STANDBY';
    let speedText = isAvailable ? '🟢 Online • Ready for dispatch' : '⚪ Offline • Standby';

    if (activeRescue) {
      if (activeRescue.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP) {
        statusText = 'AT_PICKUP';
        speedText = 'Arrived at donor location';
      } else if (activeRescue.status === DONATION_STATUS.PICKED_UP || activeRescue.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS) {
        statusText = 'IN_TRANSIT';
        speedText = '24 km/h • In transit to destination';
      } else if (activeRescue.status === DONATION_STATUS.PROOF_SUBMITTED) {
        statusText = 'PROOF_SUBMITTED';
        speedText = 'Delivered • Awaiting Admin verification';
      } else {
        statusText = 'EN_ROUTE_PICKUP';
        speedText = '22 km/h • En route to donor pickup';
      }
    }

    const isTwoWheeler = (vol.transportType || '').toLowerCase().includes('two') || (vol.transportType || '').toLowerCase().includes('bike');

    return {
      id: vol.id,
      name: vol.name,
      phone: vol.phone || '+91 98123 45678',
      role: `${vol.tier || 'Annasevak'} (${vol.rewardPoints || 100} pts)`,
      vehicle: vol.transportType || 'Two-Wheeler',
      icon: isTwoWheeler ? Bike : Truck,
      x: defaultX,
      y: defaultY,
      isAvailable,
      status: statusText,
      corridorId,
      corridorName,
      activeMission: activeRescue || null,
      speed: speedText,
      lastGpsPing: `12.${9710 + idx * 14}° N, 77.${6410 + idx * 42}° E (Live)`,
      avatar: vol.idDocumentPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
  });

  // Pickups
  const pickupPins = [
    {
      id: 'pickup-01',
      name: 'Grand Celebrations Banquet Hall',
      address: '80 Feet Road, Indiranagar',
      x: 410,
      y: 210,
      meals: 140,
      food: 'Veg Biryani, Paneer Masala',
      ref: 'AS-101',
      status: 'SUBMITTED'
    },
    {
      id: 'pickup-02',
      name: 'Embassy TechVillage (Tower 3)',
      address: 'Outer Ring Rd, Bellandur',
      x: 690,
      y: 350,
      meals: 85,
      food: 'Lunch Combos (Dal Tadka, Rice)',
      ref: 'AS-102',
      status: 'ASSIGNED_AWAITING_ACCEPTANCE'
    },
    {
      id: 'pickup-03',
      name: 'Defence Colony Residence',
      address: '100 Feet Rd, Indiranagar',
      x: 440,
      y: 230,
      meals: 110,
      food: 'Veg Pulao, Mirchi Salan',
      ref: 'AS-103',
      status: 'VOLUNTEER_AT_PICKUP'
    }
  ];

  // Distribution Shelters
  const destinationPins = [
    {
      id: 'dest-01',
      name: 'Pragati Shelter Kitchen (Ward 4)',
      address: '14, 2nd Main, Indiranagar',
      x: 450,
      y: 270,
      capacity: '250 Meals/day',
      type: 'Night Shelter'
    },
    {
      id: 'dest-02',
      name: 'Hope NGO Children Home',
      address: '88, Shivaji Nagar Circular Rd',
      x: 290,
      y: 150,
      capacity: '140 Meals/day',
      type: 'Care Home'
    },
    {
      id: 'dest-03',
      name: 'Annapurna Relief Point',
      address: 'Under Flyover, Old Airport Road',
      x: 530,
      y: 260,
      capacity: '300 Meals/day',
      type: 'Need Zone'
    }
  ];

  // Corridors Polylines
  const corridorPaths = [
    {
      id: 'corridor-01',
      name: 'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board',
      shortName: 'Central-East Tech Artery',
      points: [
        MAP_NODES.indiranagar,
        MAP_NODES.domlur,
        MAP_NODES.koramangala,
        MAP_NODES.silkBoard
      ],
      detourPoints: [
        MAP_NODES.indiranagar,
        MAP_NODES.innerRingDetour,
        MAP_NODES.silkBoard
      ]
    },
    {
      id: 'corridor-02',
      name: 'Whitefield ➔ Marathahalli ➔ Bellandur ➔ Sarjapur',
      shortName: 'Eastern IT & Outer Ring Corridor',
      points: [
        MAP_NODES.whitefield,
        MAP_NODES.marathahalli,
        MAP_NODES.bellandur,
        MAP_NODES.sarjapur
      ],
      detourPoints: [
        MAP_NODES.whitefield,
        MAP_NODES.varthurDetour,
        MAP_NODES.sarjapur
      ]
    },
    {
      id: 'corridor-03',
      name: 'Shivaji Nagar ➔ Frazer Town ➔ MG Road ➔ Ulsoor',
      shortName: 'Central Heritage Corridor',
      points: [
        MAP_NODES.frazerTown,
        MAP_NODES.shivajiNagar,
        MAP_NODES.mgRoad,
        MAP_NODES.ulsoor
      ]
    },
    {
      id: 'corridor-04',
      name: 'Jayanagar ➔ JP Nagar ➔ Banashankari ➔ Kanakapura',
      shortName: 'South Bengaluru Metro Artery',
      points: [
        MAP_NODES.jayanagar,
        MAP_NODES.jpNagar,
        MAP_NODES.banashankari,
        MAP_NODES.kanakapura
      ]
    }
  ];

  const getPointsD = (nodes) => {
    return nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ');
  };

  return (
    <div className="as-card as-card-elevated" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '4px solid #3b82f6' }}>
      {/* Top Map Command Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Admin Live Operations & Volunteer Route Radar
            </h3>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Radio size={11} className="animate-pulse" />
              LIVE GPS TELEMETRY
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', margin: 0 }}>
            Interactive real-time map tracking Bengaluru food rescue missions, active courier GPS positions, and zero-detour commute routes.
          </p>
        </div>

        {/* Tactical Filters & Layers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-default)' }}>
            {[
              { id: 'ALL', label: 'All Fleet (3)' },
              { id: 'ACTIVE_ONLY', label: 'Active Missions (2)' },
              { id: 'CONGESTED', label: simulatedJamCorridorId ? 'Congested (1)' : 'Congested (0)' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 9px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: filterMode === f.id ? 'var(--brand-500)' : 'transparent',
                  color: filterMode === f.id ? '#0b1120' : 'var(--text-secondary)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Layer toggles */}
          <button
            type="button"
            onClick={() => setLayerVisibility(prev => ({ ...prev, volunteers: !prev.volunteers }))}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${layerVisibility.volunteers ? 'var(--brand-500)' : 'var(--border-default)'}`,
              backgroundColor: layerVisibility.volunteers ? 'rgba(217, 119, 6, 0.15)' : 'transparent',
              color: layerVisibility.volunteers ? 'var(--brand-500)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Bike size={12} />
            Couriers
          </button>

          <button
            type="button"
            onClick={() => setLayerVisibility(prev => ({ ...prev, pickups: !prev.pickups }))}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${layerVisibility.pickups ? '#f59e0b' : 'var(--border-default)'}`,
              backgroundColor: layerVisibility.pickups ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: layerVisibility.pickups ? '#fbbf24' : 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Utensils size={12} />
            Food Donors
          </button>

          <button
            type="button"
            onClick={() => setLayerVisibility(prev => ({ ...prev, destinations: !prev.destinations }))}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${layerVisibility.destinations ? '#10b981' : 'var(--border-default)'}`,
              backgroundColor: layerVisibility.destinations ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: layerVisibility.destinations ? '#34d399' : 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Building size={12} />
            Shelters
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#0a0f1d',
          overflow: 'hidden',
          border: '1px solid #1e293b',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)'
        }}
      >
        {/* Radar Background Grid Pattern */}
        <svg
          viewBox="0 0 1000 640"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            userSelect: 'none'
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>

            {/* Glowing Pulse for Volunteers */}
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Tactical Background Grid */}
          <rect width="1000" height="640" fill="url(#grid)" />

          {/* Radar Scanner Rings */}
          <circle cx="450" cy="280" r="140" fill="none" stroke="rgba(56, 189, 248, 0.06)" strokeWidth="1" />
          <circle cx="450" cy="280" r="260" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="450" cy="280" r="380" fill="none" stroke="rgba(56, 189, 248, 0.03)" strokeWidth="1" />

          {/* Area Label Annotations on Map */}
          <text x="310" y="140" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">CENTRAL HERITAGE ZONE</text>
          <text x="440" y="200" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">INDIRANAGAR TECH HUB</text>
          <text x="760" y="170" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">WHITEFIELD IT CORRIDOR</text>
          <text x="640" y="340" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">BELLANDUR OUTER RING RD</text>
          <text x="210" y="370" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">JAYANAGAR RESIDENTIAL</text>

          {/* ================= CORRIDOR ARTERIAL LINES ================= */}
          {layerVisibility.routes && corridorPaths.map(cp => {
            const isCorridorJammed = simulatedJamCorridorId === cp.id;
            const isSelected = selectedEntity?.type === 'corridor' && selectedEntity.data.id === cp.id;
            const strokeColor = isCorridorJammed ? '#ef4444' : isSelected ? '#38bdf8' : '#10b981';

            return (
              <g
                key={cp.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedEntity({ type: 'corridor', data: cp })}
              >
                {/* Thick background hit area */}
                <path
                  d={getPointsD(cp.points)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="24"
                />

                {/* Outer Glow Line */}
                <path
                  d={getPointsD(cp.points)}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isCorridorJammed ? '6' : isSelected ? '5' : '3.5'}
                  strokeOpacity={isCorridorJammed ? 0.8 : 0.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={isCorridorJammed ? 'url(#glow-red)' : 'url(#glow-green)'}
                  strokeDasharray={isCorridorJammed ? '8 6' : 'none'}
                />

                {/* Core bright line */}
                <path
                  d={getPointsD(cp.points)}
                  fill="none"
                  stroke={isCorridorJammed ? '#fca5a5' : '#a7f3d0'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Detour line if jammed */}
                {isCorridorJammed && cp.detourPoints && (
                  <g>
                    <path
                      d={getPointsD(cp.detourPoints)}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      filter="url(#glow-cyan)"
                    />
                    <text
                      x={(cp.detourPoints[1].x)}
                      y={(cp.detourPoints[1].y - 10)}
                      fill="#38bdf8"
                      fontSize="10"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      ⚡ ACTIVATED DETOUR BYPASS
                    </text>
                  </g>
                )}

                {/* Waypoint Junction Dots along corridor */}
                {cp.points.map(pt => (
                  <circle
                    key={pt.id}
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 4.5 : 3.5}
                    fill={isCorridorJammed ? '#f87171' : '#34d399'}
                    stroke="#0a0f1d"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            );
          })}

          {/* ================= DESTINATION SHELTERS ================= */}
          {layerVisibility.destinations && destinationPins.map(dest => {
            const isSelected = selectedEntity?.type === 'destination' && selectedEntity.data.id === dest.id;
            return (
              <g
                key={dest.id}
                transform={`translate(${dest.x}, ${dest.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedEntity({ type: 'destination', data: dest })}
              >
                <circle r={isSelected ? 16 : 12} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />
                <circle r={5} fill="#10b981" />
                <text x="14" y="4" fill="#a7f3d0" fontSize="10.5" fontWeight="700">
                  {dest.name.split('(')[0].trim()}
                </text>
              </g>
            );
          })}

          {/* ================= FOOD DONOR PICKUP POINTS ================= */}
          {layerVisibility.pickups && pickupPins.map(pk => {
            const isSelected = selectedEntity?.type === 'pickup' && selectedEntity.data.id === pk.id;
            return (
              <g
                key={pk.id}
                transform={`translate(${pk.x}, ${pk.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedEntity({ type: 'pickup', data: pk })}
              >
                <circle r={isSelected ? 15 : 11} fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" />
                <circle r={4.5} fill="#fbbf24" />
                <text x="13" y="-3" fill="#fbbf24" fontSize="10.5" fontWeight="800">
                  #{pk.ref}
                </text>
                <text x="13" y="9" fill="#cbd5e1" fontSize="9.5">
                  {pk.meals} meals
                </text>
              </g>
            );
          })}

          {/* ================= LIVE VOLUNTEER COURIERS ================= */}
          {layerVisibility.volunteers && volunteerPins
            .filter(v => {
              if (filterMode === 'ACTIVE_ONLY') return v.status !== 'IDLE_STANDBY';
              if (filterMode === 'CONGESTED') return v.corridorId === simulatedJamCorridorId;
              return true;
            })
            .map(vol => {
              const isSelected = selectedEntity?.type === 'volunteer' && selectedEntity.data.id === vol.id;
              const isVolunteerAtPickup = vol.status === 'AT_PICKUP';

              return (
                <g
                  key={vol.id}
                  transform={`translate(${vol.x}, ${vol.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEntity({ type: 'volunteer', data: vol })}
                >
                  {/* Radar Pulse Ring */}
                  <circle
                    r={isSelected ? 22 : 16}
                    fill="none"
                    stroke={isVolunteerAtPickup ? '#38bdf8' : '#22c55e'}
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                    className="animate-pulse"
                  />
                  {/* Halo */}
                  <circle
                    r={isSelected ? 14 : 10}
                    fill={isVolunteerAtPickup ? 'rgba(56, 189, 248, 0.35)' : 'rgba(34, 197, 94, 0.35)'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Center Dot */}
                  <circle r={4} fill={isVolunteerAtPickup ? '#38bdf8' : '#22c55e'} />

                  {/* Courier Badge Tag */}
                  <rect
                    x="12"
                    y="-12"
                    width={vol.name.length * 6.5 + 24}
                    height="20"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth="1"
                  />
                  <text x="18" y="2" fill="#f8fafc" fontSize="10" fontWeight="700">
                    {vol.vehicle.includes('Two-Wheeler') ? '🏍️' : '🚐'} {vol.name}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Legend Overlay (Bottom Left of Map) */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '10.5px',
            color: '#cbd5e1',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            Active Courier (GPS)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            Surplus Food Source
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Verified Shelter
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#ef4444' }} />
            Heavy Jam Alert
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#06b6d4' }} />
            Detour Reroute
          </span>
        </div>

        {/* Live Simulation Quick Trigger (Top Right of Map) */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px'
          }}
        >
          <button
            type="button"
            onClick={() => onToggleJam && onToggleJam('corridor-01')}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: simulatedJamCorridorId ? '#7f1d1d' : 'rgba(30, 41, 59, 0.9)',
              border: `1px solid ${simulatedJamCorridorId ? '#ef4444' : '#475569'}`,
              color: simulatedJamCorridorId ? '#fca5a5' : '#e2e8f0',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {simulatedJamCorridorId ? (
              <>
                <Zap size={13} style={{ color: '#ef4444' }} className="animate-pulse" />
                Clear Simulated Traffic Jam
              </>
            ) : (
              <>
                <AlertTriangle size={13} style={{ color: '#fbbf24' }} />
                Simulate Jam on Silk Board
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected Entity Inspector Panel (When Admin Clicks any pin or route) */}
      {selectedEntity ? (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {selectedEntity.type === 'volunteer' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={selectedEntity.data.avatar}
                alt={selectedEntity.data.name}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{selectedEntity.data.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--brand-500)', fontWeight: 600 }}>({selectedEntity.data.vehicle})</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  📍 GPS: <strong style={{ color: '#38bdf8' }}>{selectedEntity.data.lastGpsPing}</strong> • Speed: {selectedEntity.data.speed}
                </div>
                {selectedEntity.data.activeMission ? (
                  <div style={{ fontSize: '11.5px', color: '#34d399', marginTop: '2px' }}>
                    Active Rescue: <strong>#{selectedEntity.data.activeMission.publicReference}</strong> ({selectedEntity.data.activeMission.quantityMeals} meals) ➔ {selectedEntity.data.activeMission.destinationName || 'Assigned Shelter'}
                  </div>
                ) : (
                  <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>No active food batch. On natural commute standby.</div>
                )}
              </div>
            </div>
          )}

          {selectedEntity.type === 'corridor' && (
            <div>
              <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{selectedEntity.data.shortName}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {selectedEntity.data.name}
              </div>
              <div style={{ fontSize: '11px', color: simulatedJamCorridorId === selectedEntity.data.id ? '#f87171' : '#34d399', marginTop: '2px', fontWeight: 700 }}>
                {simulatedJamCorridorId === selectedEntity.data.id ? '🚨 HIGH CONGESTION • Peak Signal Queue Backed Up (+28 min)' : '✓ Optimal Flow • Green Commute Corridor (Average speed 22 km/h)'}
              </div>
            </div>
          )}

          {selectedEntity.type === 'pickup' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{selectedEntity.data.name}</strong>
                <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                  Surplus #{selectedEntity.data.ref}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {selectedEntity.data.food} • <strong style={{ color: '#fbbf24' }}>{selectedEntity.data.meals} Meals</strong>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Address: {selectedEntity.data.address}
              </div>
            </div>
          )}

          {selectedEntity.type === 'destination' && (
            <div>
              <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{selectedEntity.data.name}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {selectedEntity.data.type} • Daily capacity: <strong style={{ color: '#34d399' }}>{selectedEntity.data.capacity}</strong>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                {selectedEntity.data.address}
              </div>
            </div>
          )}

          {/* Quick Inspector Actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {selectedEntity.type === 'volunteer' && (
              <>
                <a
                  href={`tel:${selectedEntity.data.phone}`}
                  style={{
                    fontSize: '11px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  <Phone size={12} /> Call Volunteer
                </a>
                <button
                  type="button"
                  onClick={() => onOpenAdvisory && onOpenAdvisory(selectedEntity.data.corridorId)}
                  style={{
                    fontSize: '11px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-500)',
                    border: 'none',
                    color: '#0b1120',
                    cursor: 'pointer',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Send size={12} /> Dispatch Alert
                </button>
              </>
            )}

            {selectedEntity.type === 'corridor' && (
              <button
                type="button"
                onClick={() => onExecuteDetour && onExecuteDetour(selectedEntity.data)}
                style={{
                  fontSize: '11px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--brand-500)',
                  border: 'none',
                  color: '#0b1120',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Zap size={12} /> Deploy Detour Bypass
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              style={{
                fontSize: '11px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-tertiary)',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-tertiary)', padding: '4px 8px' }}>
          <span>💡 <em>Click any courier pin, surplus food source, or route line on the map above to inspect live telemetry.</em></span>
          <span style={{ color: '#38bdf8' }}>Auto-refreshing GPS pins: 5s interval</span>
        </div>
      )}
    </div>
  );
};
