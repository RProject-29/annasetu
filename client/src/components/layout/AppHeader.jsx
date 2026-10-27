import React, { useState, useEffect, useRef } from 'react';
import { ROLES } from '../../constants/roles';
import { BrandLogo } from '../common/BrandLogo';
import {
  ArrowLeft,
  Bell,
  Home,
  User,
  Bike,
  HeartHandshake,
  Trophy,
  History,
  Settings,
  LogOut,
  LogIn,
  Check,
  ChevronDown,
  UserPlus
} from 'lucide-react';

export const AppHeader = ({
  activeRole,
  activeVolunteer,
  isLoggedIn = true,
  donorUser = null,
  onNavigateHome,
  onNavigateProfile,
  onNavigateRegister,
  onNavigateHistory,
  onOpenAchievements,
  onRoleChange,
  onLogout,
  onOpenLogin,
  onOpenDonorLogin,
  onDonorLogout,
  onBack,
  onOpenNotifications,
  unreadNotificationsCount = 0
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Current persona display details
  const isDonor = activeRole === ROLES.DONOR;
  const isDonorLoggedIn = Boolean(donorUser && donorUser.name && donorUser.isLoggedIn !== false);

  const currentName = isDonor
    ? (isDonorLoggedIn ? donorUser.name : 'Guest Food Donor')
    : (isLoggedIn && activeVolunteer?.name ? activeVolunteer.name : 'Guest Volunteer');

  const currentRoleLabel = isDonor
    ? (isDonorLoggedIn ? 'Food Donor (Annadata) • Verified' : 'Tap to Login as Donor')
    : (isLoggedIn ? 'Rescue Volunteer (Annasevak) • Verified' : 'Tap to Login as Volunteer');

  const avatarInitial = isDonor
    ? (isDonorLoggedIn ? donorUser.name[0]?.toUpperCase() : 'D')
    : (isLoggedIn && activeVolunteer?.name ? activeVolunteer.name[0]?.toUpperCase() : 'V');

  return (
    <header className="mobile-app-header" ref={dropdownRef}>
      {/* 1. Left: Small Back Arrow Button + Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={onBack}
          className="header-back-btn"
          title="Go back to previous page"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </button>

        <div
          onClick={onNavigateHome}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="AnnaSetu Home"
        >
          <BrandLogo size={32} showText={true} />
        </div>
      </div>

      {/* 2. Right: Notification, Home & Profile Symbols */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {/* Beside Home: Real-time Food Tracking & Rescue Notifications */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="header-icon-btn"
          title="Food Rescue Updates & Live Notifications"
          aria-label="Food Rescue Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} style={{ color: 'var(--brand-600)' }} />
          {unreadNotificationsCount > 0 && (
            <span className="header-notif-badge">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Permanent Option 1: Home Symbol */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="header-icon-btn"
          title="Home"
          aria-label="Home"
        >
          <Home size={18} style={{ color: 'var(--brand-600)' }} />
        </button>

        {/* Permanent Option 2: Profile Symbol (Click opens right-side dropdown) */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`header-icon-btn ${isDropdownOpen ? 'active' : ''}`}
          title="Profile Menu & Account Options"
          aria-label="Profile Menu"
        >
          <User size={18} style={{ color: 'var(--brand-600)' }} />
        </button>

        {/* 3. Right-Side Profile Dropdown Menu */}
        {isDropdownOpen && (
          <div className="profile-right-dropdown animate-slide-down">
            {/* Header: User Summary */}
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                marginBottom: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--brand-gradient)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {avatarInitial}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {currentRoleLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Login As Role / Switch Persona */}
            <div style={{ padding: '6px 8px 2px', fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sign In / Choose Role
            </div>

            {/* 1. Login as Food Donor (Annadata) */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                if (!isDonorLoggedIn) {
                  if (onOpenDonorLogin) onOpenDonorLogin('Sign in as Food Donor to report and track surplus meals.');
                } else {
                  onRoleChange(ROLES.DONOR);
                }
              }}
              className="dropdown-item"
              style={{
                backgroundColor: isDonor ? 'var(--brand-50)' : 'transparent',
                color: isDonor ? 'var(--brand-700)' : 'var(--text-primary)'
              }}
            >
              <HeartHandshake size={16} style={{ color: 'var(--brand-500)' }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>
                  Login as Food Donor (Annadata)
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {isDonorLoggedIn
                    ? `Active: ${donorUser.name}`
                    : 'Hotels, caterers & banquets • Sign in'}
                </div>
              </div>
              {isDonor && isDonorLoggedIn && <Check size={14} style={{ color: 'var(--brand-600)' }} />}
            </button>

            {/* 2. Login as Rescue Volunteer (Annasevak) */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                if (!isLoggedIn) {
                  if (onOpenLogin) onOpenLogin();
                } else {
                  onRoleChange(ROLES.VOLUNTEER);
                }
              }}
              className="dropdown-item"
              style={{
                backgroundColor: !isDonor ? 'var(--brand-50)' : 'transparent',
                color: !isDonor ? 'var(--brand-700)' : 'var(--text-primary)'
              }}
            >
              <Bike size={16} style={{ color: 'var(--status-success-solid)' }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>
                  Login as Rescue Volunteer (Annasevak)
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {isLoggedIn
                    ? `Active: ${activeVolunteer?.name || 'Aarav'}`
                    : 'Surplus couriers & relief team • Sign in'}
                </div>
              </div>
              {!isDonor && isLoggedIn && <Check size={14} style={{ color: 'var(--brand-600)' }} />}
            </button>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

            {/* Section 2: Account Actions & Navigation */}
            <div style={{ padding: '4px 8px 2px', fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Account & Options
            </div>

            {/* Option A: My Profile */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigateProfile();
              }}
              className="dropdown-item"
            >
              <User size={16} style={{ color: 'var(--brand-600)' }} />
              <span>My Profile & Info</span>
            </button>

            {/* Option B: New Volunteer Registration */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigateRegister();
              }}
              className="dropdown-item"
              style={{ color: 'var(--brand-700)' }}
            >
              <UserPlus size={16} style={{ color: 'var(--brand-600)' }} />
              <span>New Volunteer Registration</span>
            </button>

            {/* Option C: My Achievements */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onOpenAchievements();
              }}
              className="dropdown-item"
            >
              <Trophy size={16} style={{ color: 'var(--brand-500)' }} />
              <span>My Achievements & Rewards</span>
            </button>

            {/* Option D: History */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigateHistory();
              }}
              className="dropdown-item"
            >
              <History size={16} style={{ color: 'var(--brand-500)' }} />
              <span>Rescue & Donation History</span>
            </button>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

            {/* Option E: Log Out Handlers for Donor & Volunteer */}
            {isDonor && isDonorLoggedIn ? (
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onDonorLogout) onDonorLogout();
                }}
                className="dropdown-item"
                style={{ color: 'var(--status-danger-solid)' }}
              >
                <LogOut size={16} />
                <span>Log Out ({donorUser?.name || 'Donor'})</span>
              </button>
            ) : isDonor && !isDonorLoggedIn ? (
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onOpenDonorLogin) onOpenDonorLogin();
                }}
                className="dropdown-item"
                style={{ color: 'var(--brand-700)', fontWeight: 700 }}
              >
                <LogIn size={16} />
                <span>Sign In as Food Donor</span>
              </button>
            ) : !isDonor && isLoggedIn ? (
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="dropdown-item"
                style={{ color: 'var(--status-danger-solid)' }}
              >
                <LogOut size={16} />
                <span>Log Out Volunteer</span>
              </button>
            ) : !isDonor && !isLoggedIn ? (
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenLogin();
                }}
                className="dropdown-item"
                style={{ color: 'var(--brand-700)', fontWeight: 700 }}
              >
                <LogIn size={16} />
                <span>Sign In as Rescue Volunteer</span>
              </button>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
};
