import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { ROLES, VOLUNTEER_STATUS } from '../../constants/roles';
import { EditProfileModal } from './EditProfileModal';
import { EditDonorProfileModal } from './EditDonorProfileModal';
import { AchievementsModal } from './AchievementsModal';
import {
  User,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  Bike,
  Power,
  RotateCcw,
  LogOut,
  Edit3,
  Clock,
  Navigation,
  Trophy,
  Award,
  Calendar,
  LogIn,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const ProfilePage = ({
  role,
  volunteer,
  isLoggedIn = true,
  donorUser = null,
  onToggleAvailability,
  onResetDemo,
  onSwitchRole,
  onUpdateProfile,
  onUpdateDonorProfile,
  onLogout,
  onDonorLogout,
  onNavigateLogin,
  onOpenDonorLogin,
  onNavigateRegister,
  onNavigateHistory
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDonorEditOpen, setIsDonorEditOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);

  const activeDonor = donorUser || storageService.getDonorUser();
  const isDonorLoggedIn = Boolean(activeDonor && activeDonor.name && activeDonor.isLoggedIn !== false);

  // 1. GATE: Unauthenticated Donor
  if (role === ROLES.DONOR && !isDonorLoggedIn) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '20px 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-50)',
            color: 'var(--brand-600)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}
        >
          <HeartHandshake size={32} />
        </div>

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Food Donor (Annadata) Account</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px', margin: '6px auto 0', lineHeight: 1.4 }}>
            Please sign in to manage your donor profile, edit pickup locations, and track your surplus meal donations.
          </p>
        </div>

        <div className="as-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            variant="primary"
            size="lg"
            block
            icon={LogIn}
            onClick={() => onOpenDonorLogin && onOpenDonorLogin('Sign in as Food Donor to access your profile and rescue history.')}
          >
            Sign In with Phone & Password
          </Button>

          <Button
            variant="outline"
            size="lg"
            block
            icon={User}
            onClick={() => onOpenDonorLogin && onOpenDonorLogin('Create your Food Donor profile.')}
          >
            New Donor? Register Here
          </Button>
        </div>
      </div>
    );
  }

  // 2. GATE: Unauthenticated Volunteer
  if (role === ROLES.VOLUNTEER && !isLoggedIn) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '20px 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-50)',
            color: 'var(--brand-600)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}
        >
          <Bike size={32} />
        </div>

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Volunteer (Annasevak) Account</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px', margin: '6px auto 0', lineHeight: 1.4 }}>
            Please sign in to view rescue dispatches, manage your commute corridor route, or edit your volunteer profile.
          </p>
        </div>

        <div className="as-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button variant="primary" size="lg" block icon={LogIn} onClick={onNavigateLogin}>
            Sign In with Username & Password
          </Button>

          <Button variant="outline" size="lg" block icon={Bike} onClick={onNavigateRegister}>
            New Volunteer? Register Here
          </Button>
        </div>
      </div>
    );
  }

  // 3. AUTHENTICATED PROFILE VIEW
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 800 }}>Account & Profile</h1>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {role === ROLES.DONOR ? 'Your Annadata food donor profile & security' : 'Your volunteer credentials, route & progress'}
          </p>
        </div>

        {role === ROLES.DONOR ? (
          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={() => setIsDonorEditOpen(true)}
            style={{ fontSize: '11.5px', padding: '4px 10px' }}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={() => setIsEditModalOpen(true)}
            style={{ fontSize: '11.5px', padding: '4px 10px' }}
          >
            Edit Info
          </Button>
        )}
      </div>

      {/* Main Profile Identity Card */}
      <div className="as-card as-card-elevated" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'var(--brand-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px',
            boxShadow: '0 3px 10px var(--brand-glow)',
            flexShrink: 0
          }}
        >
          {role === ROLES.DONOR ? (activeDonor?.name ? activeDonor.name[0] : 'D') : volunteer?.name ? volunteer.name[0] : 'V'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800 }}>
              {role === ROLES.DONOR ? (activeDonor?.name || 'Rohit Sharma') : volunteer?.name || 'Aarav Patel'}
            </h2>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                padding: '1.5px 7px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: role === ROLES.DONOR ? 'var(--brand-50)' : 'var(--status-success-bg)',
                color: role === ROLES.DONOR ? 'var(--brand-700)' : 'var(--status-success-solid)',
                border: `1px solid ${role === ROLES.DONOR ? 'var(--brand-100)' : 'var(--status-success-border)'}`,
                whiteSpace: 'nowrap'
              }}
            >
              {role === ROLES.DONOR ? 'Food Donor (Annadata) • Verified' : volunteer?.status === 'PENDING' ? 'Pending KYC' : 'Verified Sevak'}
            </span>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {role === ROLES.DONOR
              ? (activeDonor?.org || 'Individual Food Donor')
              : `@${volunteer?.username || 'volunteer'} • ${volunteer?.gender || 'Male'}, ${volunteer?.age || 26} yrs`}
          </p>
        </div>
      </div>

      {/* DONOR SPECIFIC DETAILS */}
      {role === ROLES.DONOR && (
        <div className="as-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '12.5px', fontWeight: 700, margin: 0 }}>
              Registered Annadata Credentials
            </h4>
            <button
              type="button"
              onClick={() => setIsDonorEditOpen(true)}
              style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-600)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Update Info ➔
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Phone size={14} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Mobile: </strong>
                <span>{activeDonor?.phone || '+91 98765 43210'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Mail size={14} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Email: </strong>
                <span>{activeDonor?.email || 'rohit.sharma@banquet.com'}</span>
              </div>
            </div>

            {activeDonor?.org && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Building size={14} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Banquet / Hall: </strong>
                  <span>{activeDonor.org}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
              <MapPin size={14} style={{ color: 'var(--brand-500)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Default Pickup Address: </strong>
                <span>{activeDonor?.address || '80 Feet Road, Indiranagar, Bengaluru'}</span>
                {activeDonor?.landmark && <span> ({activeDonor.landmark})</span>}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
              <Lock size={14} style={{ color: 'var(--status-success-solid)', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Password Security: </strong>
                <span style={{ color: 'var(--status-success-solid)', fontWeight: 600 }}>•••••••• (Protected)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Operational Availability Setting */}
      {role === ROLES.VOLUNTEER && (
        <div className="as-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: 700, margin: 0 }}>Rescue Availability</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Toggle offline when you are not available.
              </p>
            </div>
            <button
              onClick={onToggleAvailability}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: volunteer?.isAvailable ? 'var(--status-success-bg)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${volunteer?.isAvailable ? 'var(--status-success-border)' : 'var(--border-default)'}`,
                color: volunteer?.isAvailable ? 'var(--status-success-solid)' : 'var(--text-tertiary)',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Power size={12} />
              <span>{volunteer?.isAvailable ? 'Online' : 'Offline'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Volunteer Preferable Route Corridor & Working Time Card */}
      {role === ROLES.VOLUNTEER && (
        <div className="as-card" style={{ padding: '12px 14px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={15} style={{ color: 'var(--brand-500)' }} />
            <span>Commute Route & Suitable Hours</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                padding: '9px 11px',
                backgroundColor: 'var(--brand-50)',
                border: '1px solid var(--brand-100)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Preferable Delivery Corridor:
              </span>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                {volunteer?.preferableRoute || 'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board'}
              </p>
              <span style={{ fontSize: '10.5px', color: 'var(--brand-700)', marginTop: '3px', display: 'block' }}>
                ✓ Surplus food pickups along this path are alerted to you instantly.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <Clock size={14} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Suitable Shift: </strong>
                <span>{volunteer?.workingSuitableTime || 'Evening (4:00 PM – 8:00 PM)'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <Bike size={14} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Vehicle: </strong>
                <span>{volunteer?.transportType || 'Two-Wheeler'} ({volunteer?.maximumDistanceKm || 12} km radius)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Achievements & Rewards Highlight */}
      {role === ROLES.VOLUNTEER && (
        <div className="as-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <Trophy size={15} style={{ color: 'var(--brand-500)' }} />
              <span>Progress, Awards & Rewards</span>
            </h4>
            <button
              onClick={() => setIsAchievementsModalOpen(true)}
              style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-600)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View Badges ➔
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div style={{ padding: '7px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-600)' }}>
                {volunteer?.mealsDistributed || 0}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Meals Saved</span>
            </div>

            <div style={{ padding: '7px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--status-success-solid)' }}>
                {volunteer?.completedRescues || 0}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Missions</span>
            </div>

            <div style={{ padding: '7px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#2563eb' }}>
                {volunteer?.rewardPoints || 100} pts
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Karma</span>
            </div>
          </div>
        </div>
      )}

      {/* Account Actions & Logout */}
      <div className="as-card" style={{ padding: '12px 14px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Account Sessions</h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {role === ROLES.DONOR && isDonorLoggedIn && (
            <Button
              variant="outline"
              block
              icon={LogOut}
              onClick={() => {
                if (window.confirm('Are you sure you want to log out of your food donor account?')) {
                  if (onDonorLogout) onDonorLogout();
                }
              }}
              style={{ color: 'var(--status-danger-solid)' }}
            >
              Log Out of Annadata ({activeDonor?.name || 'Donor'})
            </Button>
          )}

          {role === ROLES.VOLUNTEER && isLoggedIn && (
            <Button
              variant="outline"
              block
              icon={LogOut}
              onClick={() => {
                if (window.confirm('Are you sure you want to log out of your volunteer account?')) {
                  if (onLogout) onLogout();
                }
              }}
              style={{ color: 'var(--status-danger-solid)' }}
            >
              Log Out of Volunteer Profile ({volunteer?.name || 'Volunteer'})
            </Button>
          )}

          <Button
            variant="outline"
            block
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('Reset all demo state to fresh default mock data?')) {
                onResetDemo();
              }
            }}
          >
            Reset Demo Data to Initial Defaults
          </Button>
        </div>
      </div>

      {/* Edit Donor Profile Modal */}
      <EditDonorProfileModal
        isOpen={isDonorEditOpen}
        onClose={() => setIsDonorEditOpen(false)}
        donorUser={activeDonor}
        onSave={(updated) => {
          if (onUpdateDonorProfile) onUpdateDonorProfile(updated);
        }}
      />

      {/* Edit Volunteer Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        volunteer={volunteer}
        onSave={onUpdateProfile}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        volunteer={volunteer}
      />
    </div>
  );
};
