import React from 'react';
import { ROLES } from '../../constants/roles';
import {
  Home,
  PlusCircle,
  History,
  User,
  Inbox,
  Navigation,
  FileCheck2
} from 'lucide-react';

export const MobileBottomNav = ({
  role,
  activeTab,
  onTabChange,
  pendingOffersCount = 0,
  hasActiveRescue = false
}) => {
  if (role === ROLES.DONOR) {
    return (
      <nav className="mobile-bottom-nav">
        <button
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          {activeTab === 'home' && <div className="active-indicator" />}
          <Home size={20} />
          <span>Home</span>
        </button>

        {/* Highlighted Center CTA for Reporting Food */}
        <button
          className="nav-center-action"
          onClick={() => onTabChange('report')}
          title="Report Surplus Food"
        >
          <PlusCircle size={28} />
        </button>

        <button
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => onTabChange('history')}
        >
          {activeTab === 'history' && <div className="active-indicator" />}
          <History size={20} />
          <span>History</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          {activeTab === 'profile' && <div className="active-indicator" />}
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    );
  }

  // Volunteer Navigation: Home | Requests | Active | Profile
  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        {activeTab === 'home' && <div className="active-indicator" />}
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
        onClick={() => onTabChange('requests')}
      >
        {activeTab === 'requests' && <div className="active-indicator" />}
        <div style={{ position: 'relative' }}>
          <Inbox size={20} />
          {pendingOffersCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-urgent-solid)'
              }}
            />
          )}
        </div>
        <span>Requests</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'active' ? 'active' : ''}`}
        onClick={() => onTabChange('active')}
      >
        {activeTab === 'active' && <div className="active-indicator" />}
        <div style={{ position: 'relative' }}>
          <Navigation size={20} />
          {hasActiveRescue && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-success-solid)'
              }}
            />
          )}
        </div>
        <span>Active</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        {activeTab === 'profile' && <div className="active-indicator" />}
        <User size={20} />
        <span>Profile</span>
      </button>
    </nav>
  );
};
