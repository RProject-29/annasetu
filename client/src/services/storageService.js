import {
  INITIAL_DONATIONS,
  INITIAL_DESTINATIONS,
  INITIAL_VOLUNTEERS,
  INITIAL_NOTIFICATIONS
} from './mockData';
import { ROLES, VOLUNTEER_STATUS } from '../constants/roles';
import { DONATION_STATUS } from '../constants/donationStatus';
import { apiService } from './apiService';

const STORAGE_KEYS = {
  DONATIONS: 'annasetu_donations',
  DESTINATIONS: 'annasetu_destinations',
  VOLUNTEERS: 'annasetu_volunteers',
  NOTIFICATIONS: 'annasetu_notifications',
  ACTIVE_ROLE: 'annasetu_active_role',
  ACTIVE_VOLUNTEER_ID: 'annasetu_active_volunteer_id',
  VOLUNTEER_LOGGED_IN: 'annasetu_volunteer_logged_in',
  DONOR_USER: 'annasetu_donor_user',
  DONOR_USERS_LIST: 'annasetu_donor_users_list',
  DONOR_POPUP_SEEN: 'annasetu_donor_popup_seen'
};

let backendStatus = { status: 'CHECKING', databaseMode: 'UNKNOWN' };

export const DEFAULT_DONORS = [
  {
    id: 'donor-01',
    name: 'Rohit Sharma',
    org: 'Grand Celebrations Banquet Hall',
    email: 'rohit.sharma@banquet.com',
    phone: '+91 98765 43210',
    address: '80 Feet Road, Indiranagar, Bengaluru',
    landmark: 'Opposite BDA Complex',
    password: 'rohit123',
    isLoggedIn: false
  },
  {
    id: 'donor-02',
    name: 'Priya Verma',
    org: 'Kaveri Caterers Bengaluru',
    email: 'priya.verma@kaveri.com',
    phone: '+91 99887 76655',
    address: 'Embassy TechVillage, Outer Ring Rd, Bengaluru',
    landmark: 'Gate 2 Security Booth',
    password: 'priya123',
    isLoggedIn: false
  }
];

const notifyChange = () => {
  window.dispatchEvent(new CustomEvent('annasetu:stateChange'));
};

export const storageService = {
  // Initialize storage & sync with backend database
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(INITIAL_DESTINATIONS));
    }
    
    // Check if stored volunteers need upgrading with credentials & extra fields
    const storedVols = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    if (!storedVols) {
      localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
    } else {
      try {
        const parsed = JSON.parse(storedVols);
        if (!parsed[0] || !parsed[0].username) {
          localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
      }
    }

    // Default registered food donors list
    if (!localStorage.getItem(STORAGE_KEYS.DONOR_USERS_LIST)) {
      localStorage.setItem(STORAGE_KEYS.DONOR_USERS_LIST, JSON.stringify(DEFAULT_DONORS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, ROLES.DONOR);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_VOLUNTEER_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_VOLUNTEER_ID, 'vol-01'); // Aarav (verified)
    }
    if (localStorage.getItem(STORAGE_KEYS.VOLUNTEER_LOGGED_IN) === null) {
      localStorage.setItem(STORAGE_KEYS.VOLUNTEER_LOGGED_IN, 'true');
    }

    // Connect and sync with Node.js Express backend and MongoDB/FileDB
    this.syncWithBackend();
    this.startAutoSync(3000);

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => this.syncWithBackend());
    }
  },

  syncTimer: null,

  startAutoSync(intervalMs = 3000) {
    if (typeof window === 'undefined' || this.syncTimer) return;
    this.syncTimer = setInterval(() => {
      this.syncWithBackend();
    }, intervalMs);
  },

  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  },

  async syncWithBackend() {
    try {
      const health = await apiService.checkHealth();
      backendStatus = health;

      if (health.status === 'ONLINE') {
        // Fetch latest from backend database
        const [serverDonations, serverVolunteers, serverDestinations, serverNotifs] = await Promise.all([
          apiService.getDonations().catch(() => null),
          apiService.getVolunteers().catch(() => null),
          apiService.getDestinations().catch(() => null),
          apiService.getNotifications().catch(() => null)
        ]);

        let hasChange = false;

        if (Array.isArray(serverDonations) && serverDonations.length > 0) {
          const currentDonationsRaw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
          const serverDonationsRaw = JSON.stringify(serverDonations);
          if (currentDonationsRaw !== serverDonationsRaw) {
            localStorage.setItem(STORAGE_KEYS.DONATIONS, serverDonationsRaw);
            hasChange = true;
          }
        } else {
          // Populate backend database with existing reports if server is fresh
          const localDonations = this.getDonations();
          const localVols = this.getVolunteers();
          const localDests = this.getDestinations();
          apiService.syncClientData({
            donations: localDonations,
            volunteers: localVols,
            destinations: localDests
          }).catch(() => {});
        }

        if (Array.isArray(serverVolunteers) && serverVolunteers.length > 0) {
          const currentVolunteersRaw = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
          const serverVolunteersRaw = JSON.stringify(serverVolunteers);
          if (currentVolunteersRaw !== serverVolunteersRaw) {
            localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, serverVolunteersRaw);
            hasChange = true;
          }
        }

        if (Array.isArray(serverDestinations) && serverDestinations.length > 0) {
          const currentDestsRaw = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
          const serverDestsRaw = JSON.stringify(serverDestinations);
          if (currentDestsRaw !== serverDestsRaw) {
            localStorage.setItem(STORAGE_KEYS.DESTINATIONS, serverDestsRaw);
            hasChange = true;
          }
        }

        if (Array.isArray(serverNotifs) && serverNotifs.length > 0) {
          const currentNotifsRaw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
          const serverNotifsRaw = JSON.stringify(serverNotifs);
          if (currentNotifsRaw !== serverNotifsRaw) {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, serverNotifsRaw);
            hasChange = true;
          }
        }

        if (hasChange) {
          notifyChange();
        }
      }
    } catch (err) {
      backendStatus = { status: 'OFFLINE' };
    }
  },

  getBackendStatus() {
    return backendStatus;
  },

  // Role & Persona Management
  getActiveRole() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || ROLES.DONOR;
  },

  setActiveRole(role, volunteerId = null) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    if (volunteerId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_VOLUNTEER_ID, volunteerId);
    }
    notifyChange();
  },

  getActiveVolunteerId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_VOLUNTEER_ID) || 'vol-01';
  },

  // Volunteer Authentication State
  isVolunteerLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.VOLUNTEER_LOGGED_IN) !== 'false';
  },

  loginVolunteer(username, password) {
    const list = this.getVolunteers();
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const matched = list.find(v => 
      (v.username && v.username.toLowerCase() === cleanUser) && 
      (v.password === cleanPass)
    );

    if (matched) {
      localStorage.setItem(STORAGE_KEYS.VOLUNTEER_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.ACTIVE_VOLUNTEER_ID, matched.id);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, ROLES.VOLUNTEER);
      notifyChange();
      return { success: true, volunteer: matched };
    }

    return { success: false, error: 'Invalid volunteer credentials. Try aarav / aarav123 or priya / priya123.' };
  },

  logoutVolunteer() {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEER_LOGGED_IN, 'false');
    notifyChange();
  },

  getCurrentVolunteer() {
    const list = this.getVolunteers();
    const currentId = this.getActiveVolunteerId();
    return list.find(v => v.id === currentId) || list[0];
  },

  // Donor Authentication & Registration State
  getRegisteredDonors() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DONOR_USERS_LIST);
      return data ? JSON.parse(data) : DEFAULT_DONORS;
    } catch {
      return DEFAULT_DONORS;
    }
  },

  getDonorUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DONOR_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  isDonorLoggedIn() {
    const donor = this.getDonorUser();
    return Boolean(donor && donor.name && donor.isLoggedIn !== false);
  },

  registerDonor(donorData) {
    const donors = this.getRegisteredDonors();
    const cleanPhone = (donorData.phone || '').trim();
    const cleanEmail = (donorData.email || '').trim().toLowerCase();
    const cleanName = (donorData.name || '').trim();

    if (!cleanName) {
      return { success: false, error: 'Please provide your full legal or donor name.' };
    }

    // Check existing
    const existing = donors.find(d => 
      (cleanPhone && d.phone && d.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')) ||
      (cleanEmail && d.email && d.email.toLowerCase() === cleanEmail)
    );

    if (existing) {
      return { success: false, error: 'A donor account with this mobile number or email already exists. Please sign in.' };
    }

    const newDonor = {
      id: `donor-${Date.now()}`,
      name: cleanName,
      org: donorData.org?.trim() || '',
      phone: cleanPhone,
      email: cleanEmail || `${cleanPhone ? cleanPhone.replace(/\D/g, '') : 'donor'}@annasetu.org`,
      address: donorData.address?.trim() || 'Indiranagar, Bengaluru',
      landmark: donorData.landmark?.trim() || '',
      password: donorData.password || 'rohit123',
      registeredAt: new Date().toISOString(),
      isLoggedIn: true
    };

    const updatedList = [newDonor, ...donors];
    localStorage.setItem(STORAGE_KEYS.DONOR_USERS_LIST, JSON.stringify(updatedList));
    localStorage.setItem(STORAGE_KEYS.DONOR_USER, JSON.stringify(newDonor));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, ROLES.DONOR);
    localStorage.setItem(STORAGE_KEYS.DONOR_POPUP_SEEN, 'true');

    // Persist to backend database
    apiService.registerDonor({
      name: cleanName,
      phone: cleanPhone,
      password: newDonor.password,
      address: newDonor.address,
      organization: newDonor.org
    }).catch(err => {
      console.warn('[StorageService] Donor registration push to API failed:', err.message);
    });

    notifyChange();
    return { success: true, donor: newDonor };
  },

  loginDonor(identifier, password) {
    if (typeof identifier === 'object' && identifier !== null) {
      const data = identifier;
      const cleanIdent = (data.phone || data.email || data.name || '').trim();
      const cleanPass = (data.password || '').trim();
      return this.authenticateDonor(cleanIdent, cleanPass, data);
    }
    return this.authenticateDonor(identifier, password);
  },

  authenticateDonor(identifier, password, fallbackData = null) {
    const donors = this.getRegisteredDonors();
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const matched = donors.find(d =>
      (d.phone && d.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
      (d.email && d.email.toLowerCase() === cleanId) ||
      (d.name && d.name.toLowerCase() === cleanId)
    );

    if (matched) {
      if (cleanPass && matched.password && matched.password !== cleanPass) {
        return { success: false, error: 'Incorrect password for this donor account.' };
      }
      const activeUser = { ...matched, isLoggedIn: true };
      localStorage.setItem(STORAGE_KEYS.DONOR_USER, JSON.stringify(activeUser));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, ROLES.DONOR);
      localStorage.setItem(STORAGE_KEYS.DONOR_POPUP_SEEN, 'true');
      notifyChange();
      return { success: true, donor: activeUser };
    }

    if (fallbackData && fallbackData.name) {
      return this.registerDonor(fallbackData);
    }

    return {
      success: false,
      error: 'Donor account not found. Try Rohit Sharma (password: rohit123) or register as a new donor.'
    };
  },

  updateDonorProfile(updatedFields) {
    const current = this.getDonorUser();
    if (!current) return { success: false, error: 'No active donor session.' };

    const donors = this.getRegisteredDonors();
    const index = donors.findIndex(d => d.id === current.id || d.phone === current.phone);

    const merged = {
      ...current,
      ...updatedFields,
      isLoggedIn: true
    };

    if (index !== -1) {
      donors[index] = { ...donors[index], ...updatedFields };
    } else {
      donors.unshift(merged);
    }

    localStorage.setItem(STORAGE_KEYS.DONOR_USERS_LIST, JSON.stringify(donors));
    localStorage.setItem(STORAGE_KEYS.DONOR_USER, JSON.stringify(merged));
    notifyChange();
    return { success: true, donor: merged };
  },

  verifyDonorPassword(enteredPassword) {
    const current = this.getDonorUser();
    if (!current) return false;
    const cleanEntered = (enteredPassword || '').trim();
    return !current.password || current.password === cleanEntered;
  },

  logoutDonor() {
    const existing = this.getDonorUser();
    if (existing) {
      localStorage.setItem(STORAGE_KEYS.DONOR_USER, JSON.stringify({ ...existing, isLoggedIn: false }));
    }
    notifyChange();
  },

  isDonorPopupSeen() {
    return localStorage.getItem(STORAGE_KEYS.DONOR_POPUP_SEEN) === 'true';
  },

  setDonorPopupSeen(seen = true) {
    localStorage.setItem(STORAGE_KEYS.DONOR_POPUP_SEEN, seen ? 'true' : 'false');
  },

  // Donations
  getDonations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      return data ? JSON.parse(data) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  },

  getDonation(id) {
    const list = this.getDonations();
    return list.find(d => d.id === id);
  },

  addDonation(newDonationData) {
    const list = this.getDonations();
    const id = `AS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const donor = this.getDonorUser();
    const newDonation = {
      id,
      publicReference: id.replace('2026-', ''),
      status: DONATION_STATUS.SUBMITTED,
      createdAt: new Date().toISOString(),
      isRealUserReport: true,
      isUserCreated: true,
      donorName: newDonationData.donorName || donor?.name || 'Rohit Sharma',
      donorOrg: newDonationData.donorOrg || donor?.org || '',
      timeline: [
        {
          status: DONATION_STATUS.SUBMITTED,
          timestamp: new Date().toISOString(),
          actor: `Donor (${newDonationData.donorName || donor?.name || 'Rohit Sharma'})`,
          note: `Report submitted for ${newDonationData.quantityMeals} meals. Safe consumption deadline: ${new Date(newDonationData.safeConsumptionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
        }
      ],
      ...newDonationData
    };

    const updated = [newDonation, ...list];
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(updated));

    // Persist to backend database via API
    apiService.createDonation(newDonation).catch(err => {
      console.warn('[StorageService] Background API push failed, stored locally:', err.message);
    });

    // Create Notification for Admin
    this.addNotification({
      forRole: ROLES.ADMIN,
      title: 'New Food Report Submitted',
      message: `${newDonation.quantityMeals} meals at ${newDonation.pickupAddress} reported. Safe deadline: ${new Date(newDonation.safeConsumptionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      donationId: id
    });

    notifyChange();
    return newDonation;
  },

  updateDonationStatus(donationId, newStatus, extraData = {}, actor = 'System') {
    const list = this.getDonations();
    const index = list.findIndex(d => d.id === donationId);
    if (index === -1) return null;

    const donation = { ...list[index] };
    const oldStatus = donation.status;
    donation.status = newStatus;

    // Merge any extra metadata (e.g. proofDetails, assignedVolunteerId, destinationId)
    Object.assign(donation, extraData);

    // Append to timeline
    const timelineEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      actor,
      note: extraData.statusNote || `Status updated from ${oldStatus} to ${newStatus}.`
    };

    donation.timeline = [...(donation.timeline || []), timelineEntry];
    list[index] = donation;

    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(list));

    // Persist update to backend database via API
    apiService.updateDonationStatus(donationId, newStatus, extraData, actor).catch(err => {
      console.warn('[StorageService] Background API status update failed, updated locally:', err.message);
    });

    // Trigger context notifications
    if (newStatus === DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE) {
      this.addNotification({
        forRole: ROLES.VOLUNTEER,
        title: 'New Rescue Offer Available',
        message: `${donation.quantityMeals} meals at ${donation.pickupAddress} assigned. Tap to view and accept.`,
        donationId
      });
    } else if (newStatus === DONATION_STATUS.ACCEPTED) {
      this.addNotification({
        forRole: ROLES.DONOR,
        title: 'Volunteer Committed to Pickup',
        message: `${donation.assignedVolunteerName || 'A volunteer'} accepted your rescue and is en route.`,
        donationId
      });
    } else if (newStatus === DONATION_STATUS.VOLUNTEER_AT_PICKUP) {
      this.addNotification({
        forRole: ROLES.DONOR,
        title: 'Volunteer Arrived at Pickup',
        message: `${donation.assignedVolunteerName || 'Volunteer'} has arrived at your location.`,
        donationId
      });
    } else if (newStatus === DONATION_STATUS.PROOF_SUBMITTED) {
      this.addNotification({
        forRole: ROLES.ADMIN,
        title: 'Distribution Evidence Awaiting Review',
        message: `Volunteer submitted proof photos for rescue ${donation.publicReference} (${donation.quantityMeals} meals).`,
        donationId
      });
    } else if (newStatus === DONATION_STATUS.COMPLETED) {
      // Award Karma Reward Points & Community Impact to the Volunteer
      const assignedVolId = donation.assignedVolunteerId;
      const assignedVolName = donation.assignedVolunteerName;
      const volunteers = this.getVolunteers();
      const volIndex = volunteers.findIndex(v => v.id === assignedVolId || v.name === assignedVolName);

      const mealsCount = Number(donation.quantityMeals) || 50;
      const earnedPoints = 150 + Math.floor(mealsCount * 0.5); // 150 base pts + 0.5 pts per meal

      if (volIndex !== -1) {
        const vol = volunteers[volIndex];
        vol.completedRescues = (Number(vol.completedRescues) || 0) + 1;
        vol.mealsDistributed = (Number(vol.mealsDistributed) || 0) + mealsCount;
        vol.hoursVolunteered = (Number(vol.hoursVolunteered) || 0) + 2;
        vol.rewardPoints = (Number(vol.rewardPoints) || 0) + earnedPoints;

        // Dynamic Tier Upgrade
        if (vol.rewardPoints >= 1500) {
          vol.tier = 'Platinum Lifesaver';
        } else if (vol.rewardPoints >= 700) {
          vol.tier = 'Gold Star Courier';
        } else if (vol.rewardPoints >= 300) {
          vol.tier = 'Silver Courier';
        }

        // Add Milestone Badges
        if (!vol.badges) vol.badges = [];
        if (vol.completedRescues >= 1 && !vol.badges.some(b => b.id === 'b_first_rescue')) {
          vol.badges.push({
            id: 'b_first_rescue',
            title: 'First Rescue Champion',
            icon: '🏅',
            desc: 'Successfully completed first verified surplus rescue mission'
          });
        }
        if (vol.mealsDistributed >= 500 && !vol.badges.some(b => b.id === 'b_500_meals')) {
          vol.badges.push({
            id: 'b_500_meals',
            title: '500 Meals Hero',
            icon: '🌟',
            desc: 'Delivered over 500 nourishing community meals'
          });
        }

        volunteers[volIndex] = vol;
        localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteers));

        // Push to backend server
        apiService.updateVolunteerProfile(vol.id, vol).catch(err => {
          console.warn('[StorageService] Push volunteer points to API failed:', err.message);
        });

        // Notify Volunteer about their reward points!
        this.addNotification({
          forRole: ROLES.VOLUNTEER,
          title: `🎉 +${earnedPoints} Karma Points Earned!`,
          message: `Admin verified your rescue #${donation.publicReference} (${mealsCount} meals). New balance: ${vol.rewardPoints} pts! Check My Achievements.`,
          donationId
        });
      }

      this.addNotification({
        forRole: ROLES.DONOR,
        title: 'Food Rescue Completed!',
        message: `Your surplus food safely nourished the community at ${donation.destinationName || 'an approved shelter'}. Verified photos ready to view. Thank you!`,
        donationId
      });
    }

    notifyChange();
    return donation;
  },

  // Destinations
  getDestinations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
      return data ? JSON.parse(data) : INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  },

  addDestination(dest) {
    const list = this.getDestinations();
    const id = `dest-${String(list.length + 1).padStart(2, '0')}`;
    const newDest = { id, active: true, ...dest };
    list.push(newDest);
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(list));
    
    // Persist to backend database
    apiService.addDestination(newDest).catch(err => {
      console.warn('[StorageService] Destination push to API failed:', err.message);
    });

    notifyChange();
    return newDest;
  },

  // Volunteers
  getVolunteers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
      return data ? JSON.parse(data) : INITIAL_VOLUNTEERS;
    } catch {
      return INITIAL_VOLUNTEERS;
    }
  },

  registerVolunteer(volunteerData) {
    const list = this.getVolunteers();
    const id = `vol-${String(list.length + 1).padStart(2, '0')}`;
    const newVol = {
      id,
      status: VOLUNTEER_STATUS.PENDING,
      completedRescues: 0,
      mealsDistributed: 0,
      hoursVolunteered: 0,
      rating: 5.0,
      rewardPoints: 100,
      tier: 'Registered Novice',
      joinedDate: new Date().toISOString().split('T')[0],
      isAvailable: false,
      badges: [
        { id: 'b0', title: 'Registered Volunteer', icon: '🌱', desc: 'Completed background registration & ID upload' }
      ],
      awards: [],
      ...volunteerData
    };
    list.push(newVol);
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VOLUNTEER_ID, id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, ROLES.VOLUNTEER);
    localStorage.setItem(STORAGE_KEYS.VOLUNTEER_LOGGED_IN, 'true');

    // Persist to backend database
    apiService.registerVolunteer(newVol).catch(err => {
      console.warn('[StorageService] Volunteer registration push to API failed:', err.message);
    });

    // Admin alert for new volunteer verification
    this.addNotification({
      forRole: ROLES.ADMIN,
      title: 'New Volunteer Application',
      message: `${newVol.name} registered. ID proof: ${newVol.idDocumentType || 'Govt ID'}. Review application to verify.`,
      volunteerId: id
    });

    notifyChange();
    return newVol;
  },

  updateVolunteerProfile(volunteerId, updatedFields) {
    const list = this.getVolunteers();
    const index = list.findIndex(v => v.id === volunteerId);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));

    apiService.updateVolunteerProfile(volunteerId, updatedFields).catch(err => {
      console.warn('[StorageService] Volunteer profile update push to API failed:', err.message);
    });

    notifyChange();
    return list[index];
  },

  updateVolunteerStatus(volunteerId, status, notes = '') {
    const list = this.getVolunteers();
    const index = list.findIndex(v => v.id === volunteerId);
    if (index === -1) return null;

    list[index].status = status;
    list[index].verificationNotes = notes;
    if (status === VOLUNTEER_STATUS.VERIFIED_ACTIVE) {
      list[index].isAvailable = true;
    }

    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));

    // Persist to backend database
    apiService.updateVolunteerStatus(volunteerId, status, notes).catch(err => {
      console.warn('[StorageService] Volunteer status update push to API failed:', err.message);
    });

    this.addNotification({
      forRole: ROLES.VOLUNTEER,
      title: status === VOLUNTEER_STATUS.VERIFIED_ACTIVE ? 'Profile Approved & Verified!' : 'Volunteer Application Update',
      message: status === VOLUNTEER_STATUS.VERIFIED_ACTIVE
        ? 'Your volunteer credentials are verified. You can now receive rescue offers!'
        : `Your application status: ${status}. ${notes}`
    });

    notifyChange();
    return list[index];
  },

  toggleVolunteerAvailability(volunteerId) {
    const list = this.getVolunteers();
    const index = list.findIndex(v => v.id === volunteerId);
    if (index === -1) return null;

    list[index].isAvailable = !list[index].isAvailable;
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));

    // Push to backend server
    apiService.toggleVolunteerAvailability(volunteerId).catch(err => {
      console.warn('[StorageService] Push volunteer availability to API failed:', err.message);
    });

    notifyChange();
    return list[index];
  },

  // Notifications
  getNotifications(role = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const list = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
      return role ? list.filter(n => !n.forRole || n.forRole === role) : list;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif
    };
    const updated = [newNotif, ...list];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    notifyChange();
    return newNotif;
  },

  markNotificationRead(id) {
    const list = this.getNotifications();
    const updated = list.map(n => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    notifyChange();
  },

  markAllNotificationsRead(role = null) {
    const list = this.getNotifications();
    const updated = list.map(n => (!role || n.forRole === role ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    notifyChange();
  },

  // Reset to clean demo data
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(INITIAL_DESTINATIONS));
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, ROLES.DONOR);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VOLUNTEER_ID, 'vol-01');
    notifyChange();
  }
};
