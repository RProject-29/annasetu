import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { ROLES, VOLUNTEER_STATUS } from './constants/roles';
import { DONATION_STATUS } from './constants/donationStatus';

// Layout Components
import { AppHeader } from './components/layout/AppHeader';
import { DonorFooterNav } from './components/layout/DonorFooterNav';
import { NotificationDrawer } from './features/notifications/NotificationDrawer';

// Donor Components
import { DonorDashboard } from './features/donor/DonorDashboard';
import { ReportFoodPage } from './features/donor/ReportFoodPage';
import { DonorHistoryPage } from './features/donor/DonorHistoryPage';
import { DonationDetailPage } from './features/donor/DonationDetailPage';

// Volunteer Components
import { VolunteerDashboard } from './features/volunteer/VolunteerDashboard';
import { VolunteerRegistrationPage } from './features/volunteer/VolunteerRegistrationPage';
import { VolunteerPendingPage } from './features/volunteer/VolunteerPendingPage';
import { VolunteerOffersPage } from './features/volunteer/VolunteerOffersPage';
import { ActiveRescuePage } from './features/volunteer/ActiveRescuePage';
import { VolunteerHistoryPage } from './features/volunteer/VolunteerHistoryPage';

// Admin Components
import { AdminDashboard } from './features/admin/AdminDashboard';

// Profile & Modals
import { ProfilePage } from './features/profile/ProfilePage';
import { AchievementsModal } from './features/profile/AchievementsModal';
import { VolunteerLoginModal } from './features/profile/VolunteerLoginModal';
import { DonorLoginModal } from './features/profile/DonorLoginModal';

// Import CSS
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

// Helper to check if current URL points to the admin route
const checkIsAdminRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.startsWith('/admin') ||
    hash.startsWith('#admin') ||
    hash.startsWith('#/admin') ||
    search.includes('admin')
  );
};

export default function App() {
  // Initialize storage
  useEffect(() => {
    storageService.init();
  }, []);

  // Separate Routing State: Admin is strictly accessible via /admin or #/admin
  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdminRoute());

  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const navigateToApp = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  // Reactive State
  const [activeRole, setActiveRole] = useState(storageService.getActiveRole());
  const [activeVolunteerId, setActiveVolunteerId] = useState(storageService.getActiveVolunteerId());
  const [isVolunteerLoggedIn, setIsVolunteerLoggedIn] = useState(storageService.isVolunteerLoggedIn());
  const [donations, setDonations] = useState(storageService.getDonations());
  const [destinations, setDestinations] = useState(storageService.getDestinations());
  const [volunteers, setVolunteers] = useState(storageService.getVolunteers());
  const [notifications, setNotifications] = useState(storageService.getNotifications());

  // Navigation State
  const [donorTab, setDonorTab] = useState('home'); // home | report | history | profile
  const [volunteerTab, setVolunteerTab] = useState('home'); // home | requests | active | profile | register | history
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Global Interactive Modals
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [donorUser, setDonorUser] = useState(storageService.getDonorUser());
  const [isDonorLoginOpen, setIsDonorLoginOpen] = useState(false);
  const [donorLoginMessage, setDonorLoginMessage] = useState('');

  // First visit check: Recommend signing in as donor
  useEffect(() => {
    if (!storageService.isDonorLoggedIn() && !storageService.isDonorPopupSeen()) {
      const timer = setTimeout(() => {
        setIsDonorLoginOpen(true);
        setDonorLoginMessage('Welcome to AnnaSetu! Please sign in or register as a Food Donor so your surplus food reports are linked directly to your name.');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Synchronize state when custom event fires
  useEffect(() => {
    const handleStateChange = () => {
      setActiveRole(storageService.getActiveRole());
      setActiveVolunteerId(storageService.getActiveVolunteerId());
      setIsVolunteerLoggedIn(storageService.isVolunteerLoggedIn());
      setDonorUser(storageService.getDonorUser());
      setDonations(storageService.getDonations());
      setDestinations(storageService.getDestinations());
      setVolunteers(storageService.getVolunteers());
      setNotifications(storageService.getNotifications());
    };

    window.addEventListener('annasetu:stateChange', handleStateChange);
    window.addEventListener('storage', handleStateChange);

    // Auto-poll every 1.5s to ensure cross-tab & multi-device updates appear live without manual refresh
    const pollInterval = setInterval(handleStateChange, 1500);

    return () => {
      window.removeEventListener('annasetu:stateChange', handleStateChange);
      window.removeEventListener('storage', handleStateChange);
      clearInterval(pollInterval);
    };
  }, []);

  // Current active volunteer object
  const currentVolunteer = volunteers.find(v => v.id === activeVolunteerId) || volunteers[0];

  // Active rescue item for volunteer
  const activeRescueItem = donations.find(
    d => (d.assignedVolunteerId === currentVolunteer?.id || d.assignedVolunteerName === currentVolunteer?.name) &&
         (d.status === DONATION_STATUS.ACCEPTED ||
          d.status === DONATION_STATUS.VOLUNTEER_AT_PICKUP ||
          d.status === DONATION_STATUS.PICKED_UP ||
          d.status === DONATION_STATUS.DISTRIBUTION_IN_PROGRESS ||
          d.status === DONATION_STATUS.PROOF_SUBMITTED)
  );

  // Role Switch Handler (Community App: Donor / Volunteer)
  const handleRoleChange = (role, volunteerId = null) => {
    storageService.setActiveRole(role, volunteerId);
    setSelectedDonation(null);
    if (role === ROLES.DONOR) setDonorTab('home');
    if (role === ROLES.VOLUNTEER) setVolunteerTab('home');
  };

  // Permanent Navigation Handlers
  const handleNavigateHome = () => {
    setSelectedDonation(null);
    setDonorTab('home');
    setVolunteerTab('home');
  };

  const handleNavigateBack = () => {
    if (selectedDonation) {
      setSelectedDonation(null);
      return;
    }
    if (communityRole === ROLES.DONOR && donorTab !== 'home') {
      setDonorTab('home');
      return;
    }
    if (communityRole === ROLES.VOLUNTEER && volunteerTab !== 'home') {
      setVolunteerTab('home');
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  const handleNavigateProfile = () => {
    setSelectedDonation(null);
    if (communityRole === ROLES.DONOR) {
      setDonorTab('profile');
    } else {
      if (!isVolunteerLoggedIn) {
        setIsLoginOpen(true);
      } else {
        setVolunteerTab('profile');
      }
    }
  };

  const handleNavigateRegister = () => {
    setSelectedDonation(null);
    storageService.setActiveRole(ROLES.VOLUNTEER);
    setActiveRole(ROLES.VOLUNTEER);
    setVolunteerTab('register');
  };

  const handleNavigateHistory = () => {
    setSelectedDonation(null);
    if (communityRole === ROLES.DONOR) {
      setDonorTab('history');
    } else {
      setVolunteerTab('history');
    }
  };

  const handleVolunteerLogout = () => {
    storageService.logoutVolunteer();
    setIsVolunteerLoggedIn(false);
    setVolunteerTab('home');
  };

  const handleVolunteerLoginSuccess = (vol) => {
    setActiveVolunteerId(vol.id);
    setIsVolunteerLoggedIn(true);
    setActiveRole(ROLES.VOLUNTEER);
    storageService.setActiveRole(ROLES.VOLUNTEER, vol.id);
    setVolunteerTab('home'); // Opens Annasevak's personal dashboard
  };

  // Donor Actions
  const handleDonorLoginSuccess = (donor) => {
    setDonorUser(donor);
    setIsDonorLoginOpen(false);
    setActiveRole(ROLES.DONOR);
    storageService.setActiveRole(ROLES.DONOR);
    setDonorTab('home'); // Opens Annadata's personal dashboard
  };

  const handleDonorLogout = () => {
    storageService.logoutDonor();
    setDonorUser(null);
    setDonorTab('home');
  };

  const handleCreateDonation = (newDonationData) => {
    const created = storageService.addDonation(newDonationData);
    setDonations(storageService.getDonations());
    return created;
  };

  // Volunteer Actions
  const handleRegisterVolunteer = (volData) => {
    const registered = storageService.registerVolunteer(volData);
    setActiveVolunteerId(registered.id);
    setIsVolunteerLoggedIn(true);
    setActiveRole(ROLES.VOLUNTEER);
    setVolunteerTab('profile');
  };

  const handleUpdateVolunteerProfile = (updatedFields) => {
    storageService.updateVolunteerProfile(currentVolunteer.id, updatedFields);
  };

  const handleAcceptOffer = (donationId) => {
    storageService.updateDonationStatus(
      donationId,
      DONATION_STATUS.ACCEPTED,
      { statusNote: `Volunteer ${currentVolunteer?.name} committed to rescue.` },
      `Volunteer (${currentVolunteer?.name})`
    );
    setVolunteerTab('active');
  };

  const handleDeclineOffer = (donationId, reason) => {
    storageService.updateDonationStatus(
      donationId,
      DONATION_STATUS.APPROVED_FOR_MATCHING,
      {
        assignedVolunteerId: null,
        assignedVolunteerName: null,
        statusNote: `Volunteer declined: ${reason}. Returned to matching queue.`
      },
      `Volunteer (${currentVolunteer?.name})`
    );
  };

  const handleUpdateStatus = (donationId, newStatus, extraData = {}) => {
    storageService.updateDonationStatus(
      donationId,
      newStatus,
      extraData,
      isAdminRoute ? 'Admin' : `Volunteer (${currentVolunteer?.name})`
    );
  };

  // Community role: mobile panel cannot be admin
  const communityRole = activeRole === ROLES.ADMIN ? ROLES.DONOR : activeRole;

  // 1. ADMIN SURFACE: Dedicated Route (/admin or #/admin)
  // Full desktop layout with no mobile simulator constraints, untouched dark slate command center
  if (isAdminRoute) {
    return (
      <div className="annasetu-app admin-portal-page">
        <main className="admin-main-viewport">
          <AdminDashboard
            donations={donations}
            destinations={destinations}
            volunteers={volunteers}
            onUpdateDonationStatus={handleUpdateStatus}
            onUpdateVolunteerStatus={(volId, status, notes) => {
              storageService.updateVolunteerStatus(volId, status, notes);
            }}
            onAddDestination={(dest) => {
              storageService.addDestination(dest);
            }}
            onNavigateApp={navigateToApp}
          />
        </main>
      </div>
    );
  }

  // 2. COMMUNITY MOBILE APP SURFACE: Route (/)
  // Laptop/Tablet: Centered in realistic smartphone bezel outline on pure white background
  // Mobile (< 768px): Native full screen with zero borders and edge-to-edge light creamy layout
  // Bottom navigation is completely removed as requested
  return (
    <div className="mobile-experience-wrapper">
      <div className="phone-mockup-frame">
        {/* Hardware Notch / Dynamic Island (only visible on tablet & laptop) */}
        <div className="phone-notch">
          <div className="phone-speaker" />
          <div className="phone-camera" />
        </div>

        {/* Inner Phone Screen */}
        <div className="phone-screen">
          <main className="app-main-content">
            {/* Top Header: Unique Logo + Name, Permanent Home & Profile Buttons */}
            <AppHeader
              activeRole={communityRole}
              activeVolunteer={currentVolunteer}
              isLoggedIn={isVolunteerLoggedIn}
              donorUser={donorUser}
              onNavigateHome={handleNavigateHome}
              onNavigateProfile={handleNavigateProfile}
              onNavigateRegister={handleNavigateRegister}
              onNavigateHistory={handleNavigateHistory}
              onOpenAchievements={() => setIsAchievementsOpen(true)}
              onRoleChange={handleRoleChange}
              onLogout={handleVolunteerLogout}
              onOpenLogin={() => setIsLoginOpen(true)}
              onOpenDonorLogin={(msg) => {
                setDonorLoginMessage(msg || '');
                setIsDonorLoginOpen(true);
              }}
              onDonorLogout={handleDonorLogout}
              onBack={handleNavigateBack}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              unreadNotificationsCount={notifications.filter(n => (!n.forRole || n.forRole === communityRole) && !n.read).length}
            />

            <div className="app-content-scroll">
              {/* Selected Donation Deep-Dive Timeline */}
              {selectedDonation ? (
                <DonationDetailPage
                  donation={donations.find(d => d.id === selectedDonation.id) || selectedDonation}
                  onBack={() => setSelectedDonation(null)}
                />
              ) : communityRole === ROLES.DONOR ? (
                /* DONOR VIEWS */
                <>
                  {donorTab === 'home' && (
                    <DonorDashboard
                      donations={donations}
                      donorUser={donorUser}
                      onOpenDonorLogin={(msg) => {
                        setDonorLoginMessage(msg || '');
                        setIsDonorLoginOpen(true);
                      }}
                      onNavigateReport={() => setDonorTab('report')}
                      onSelectDonation={(d) => setSelectedDonation(d)}
                    />
                  )}
                  {donorTab === 'report' && (
                    <ReportFoodPage
                      onBack={() => setDonorTab('home')}
                      onSubmitSuccess={handleCreateDonation}
                      onTrackDonation={(created) => setSelectedDonation(created)}
                      onNavigateHistory={() => setDonorTab('history')}
                    />
                  )}
                  {donorTab === 'history' && (
                    <DonorHistoryPage
                      donations={donations}
                      onSelectDonation={(d) => setSelectedDonation(d)}
                    />
                  )}
                  {donorTab === 'profile' && (
                    <ProfilePage
                      role={communityRole}
                      donorUser={donorUser}
                      onResetDemo={() => storageService.resetDemoData()}
                      onSwitchRole={handleRoleChange}
                      onNavigateHistory={() => setDonorTab('history')}
                      onOpenDonorLogin={(msg) => {
                        setDonorLoginMessage(msg || '');
                        setIsDonorLoginOpen(true);
                      }}
                      onDonorLogout={handleDonorLogout}
                      onUpdateDonorProfile={(updated) => {
                        setDonorUser(updated);
                      }}
                    />
                  )}
                </>
              ) : (
                /* VOLUNTEER VIEWS */
                volunteerTab === 'register' ? (
                  <VolunteerRegistrationPage
                    onSubmitRegistration={handleRegisterVolunteer}
                    onNavigateLogin={() => setIsLoginOpen(true)}
                    onBack={() => setVolunteerTab('home')}
                  />
                ) : volunteerTab === 'history' ? (
                  <VolunteerHistoryPage
                    volunteer={currentVolunteer}
                    donations={donations}
                    onSelectDonation={(d) => setSelectedDonation(d)}
                    onBack={() => setVolunteerTab('home')}
                  />
                ) : currentVolunteer?.status === VOLUNTEER_STATUS.PENDING ? (
                  /* Pending Verification State Screen */
                  <VolunteerPendingPage
                    volunteer={currentVolunteer}
                    onSimulateAdminApproval={() => {
                      storageService.updateVolunteerStatus(
                        currentVolunteer.id,
                        VOLUNTEER_STATUS.VERIFIED_ACTIVE,
                        'Verified via instant test simulation'
                      );
                    }}
                    onSwitchToVerified={() => {
                      storageService.setActiveRole(ROLES.VOLUNTEER, 'vol-01');
                    }}
                  />
                ) : (
                  /* Verified Volunteer Views */
                  <>
                    {volunteerTab === 'home' && (
                      <VolunteerDashboard
                        volunteer={currentVolunteer}
                        donations={donations}
                        onToggleAvailability={() => {
                          storageService.toggleVolunteerAvailability(currentVolunteer.id);
                        }}
                        onNavigateOffers={() => setVolunteerTab('requests')}
                        onNavigateActiveRescue={() => setVolunteerTab('active')}
                        onSelectDonation={(d) => setSelectedDonation(d)}
                        onAcceptOffer={handleAcceptOffer}
                        onDeclineOffer={handleDeclineOffer}
                        onOpenEditProfile={() => setVolunteerTab('profile')}
                      />
                    )}
                    {volunteerTab === 'requests' && (
                      <VolunteerOffersPage
                        offers={donations.filter(
                          d => d.status === DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE &&
                               (d.assignedVolunteerId === currentVolunteer?.id || d.assignedVolunteerName === currentVolunteer?.name)
                        )}
                        onAcceptOffer={handleAcceptOffer}
                        onDeclineOffer={handleDeclineOffer}
                        onBack={() => setVolunteerTab('home')}
                      />
                    )}
                    {volunteerTab === 'active' && (
                      <ActiveRescuePage
                        rescue={activeRescueItem}
                        onUpdateStatus={handleUpdateStatus}
                        onBack={() => setVolunteerTab('home')}
                      />
                    )}
                    {volunteerTab === 'profile' && (
                      <ProfilePage
                        role={communityRole}
                        volunteer={currentVolunteer}
                        isLoggedIn={isVolunteerLoggedIn}
                        onToggleAvailability={() => {
                          storageService.toggleVolunteerAvailability(currentVolunteer.id);
                        }}
                        onResetDemo={() => storageService.resetDemoData()}
                        onSwitchRole={handleRoleChange}
                        onUpdateProfile={handleUpdateVolunteerProfile}
                        onLogout={handleVolunteerLogout}
                        onNavigateLogin={() => setIsLoginOpen(true)}
                        onNavigateRegister={handleNavigateRegister}
                        onNavigateHistory={handleNavigateHistory}
                      />
                    )}
                  </>
                )
              )}
            </div>

            {/* Donor Bottom Footer Navigation Bar — Distinct Color Shade */}
            {communityRole === ROLES.DONOR && (
              <DonorFooterNav
                currentTab={donorTab}
                isTracking={selectedDonation !== null}
                hasActiveDonation={Boolean(
                  donations.find(
                    d => d.status !== DONATION_STATUS.COMPLETED &&
                         d.status !== DONATION_STATUS.CANCELLED &&
                         d.status !== DONATION_STATUS.EXPIRED
                  )
                )}
                onNavigateHome={() => {
                  setSelectedDonation(null);
                  setDonorTab('home');
                }}
                onNavigateYourDonations={() => {
                  setSelectedDonation(null);
                  setDonorTab('history');
                }}
                onNavigateTrack={() => {
                  const active = donations.find(
                    d => d.status !== DONATION_STATUS.COMPLETED &&
                         d.status !== DONATION_STATUS.CANCELLED &&
                         d.status !== DONATION_STATUS.EXPIRED
                  );
                  if (active) {
                    setSelectedDonation(active);
                  } else if (donations.length > 0) {
                    setSelectedDonation(donations[0]);
                  } else {
                    setDonorTab('history');
                  }
                }}
              />
            )}
          </main>

          {/* Global In-App Notifications Drawer */}
          <NotificationDrawer
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications.filter(n => !n.forRole || n.forRole === communityRole)}
            onMarkRead={(id) => storageService.markNotificationRead(id)}
            onMarkAllRead={() => storageService.markAllNotificationsRead(communityRole)}
            onSelectDonation={(donationId) => {
              const found = donations.find(d => d.id === donationId);
              if (found) setSelectedDonation(found);
            }}
          />

          {/* Interactive Achievements & Rewards Modal */}
          <AchievementsModal
            isOpen={isAchievementsOpen}
            onClose={() => setIsAchievementsOpen(false)}
            volunteer={currentVolunteer}
          />

          {/* Interactive Volunteer Login Modal */}
          <VolunteerLoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={handleVolunteerLoginSuccess}
            onNavigateRegister={handleNavigateRegister}
          />

          {/* Interactive Food Donor Login / Registration Modal */}
          <DonorLoginModal
            isOpen={isDonorLoginOpen}
            onClose={() => {
              setIsDonorLoginOpen(false);
              storageService.setDonorPopupSeen(true);
            }}
            onLoginSuccess={handleDonorLoginSuccess}
            initialMessage={donorLoginMessage}
          />
        </div>

        {/* Home Indicator Bar */}
        <div className="phone-home-indicator" />
      </div>

      {/* Desktop Helper Link for Admin (/admin) */}
      <div className="desktop-admin-hint">
        <span>AnnaSetu Mobile Community Platform</span>
        <span style={{ margin: '0 8px', opacity: 0.5 }}>•</span>
        <a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            navigateToAdmin();
          }}
          className="desktop-admin-link"
        >
          Open Admin Portal (/admin) ↗
        </a>
      </div>
    </div>
  );
}
