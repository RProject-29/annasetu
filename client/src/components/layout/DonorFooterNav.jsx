import React from 'react';
import { Home, HeartHandshake, Navigation } from 'lucide-react';

export const DonorFooterNav = ({
  currentTab = 'home',
  isTracking = false,
  hasActiveDonation = false,
  onNavigateHome,
  onNavigateYourDonations,
  onNavigateTrack
}) => {
  return (
    <nav className="donor-footer-nav" aria-label="Donor Quick Navigation">
      {/* 1. Home Dashboard */}
      <button
        type="button"
        onClick={onNavigateHome}
        className={`footer-nav-item ${currentTab === 'home' && !isTracking ? 'active' : ''}`}
        aria-label="Home Dashboard"
      >
        <div className="footer-nav-icon-wrapper">
          <Home size={19} />
        </div>
        <span className="footer-nav-label">Home</span>
      </button>

      {/* 2. Your Donations Option */}
      <button
        type="button"
        onClick={onNavigateYourDonations}
        className={`footer-nav-item ${currentTab === 'history' && !isTracking ? 'active' : ''}`}
        aria-label="Your Donations"
      >
        <div className="footer-nav-icon-wrapper">
          <HeartHandshake size={20} />
        </div>
        <span className="footer-nav-label">Your Donations</span>
      </button>

      {/* 3. Track Donation Option with Navigate Icon */}
      <button
        type="button"
        onClick={onNavigateTrack}
        className={`footer-nav-item ${isTracking ? 'active' : ''}`}
        aria-label="Track Your Donation"
      >
        <div className="footer-nav-icon-wrapper">
          <Navigation size={19} className="nav-compass-icon" />
          {hasActiveDonation && (
            <span className="footer-active-rescue-pulse" title="Active Rescue in Progress" />
          )}
        </div>
        <span className="footer-nav-label">Track Donation</span>
      </button>
    </nav>
  );
};
