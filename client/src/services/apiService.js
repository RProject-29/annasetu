const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
};

export const apiService = {
  // Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return await handleResponse(res);
    } catch {
      return { status: 'OFFLINE' };
    }
  },

  // Auth: Donors
  async registerDonor(donorData) {
    const res = await fetch(`${API_BASE}/auth/register-donor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData)
    });
    return handleResponse(res);
  },

  async loginDonor(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login-donor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    return handleResponse(res);
  },

  // Auth: Volunteers
  async registerVolunteer(volData) {
    const res = await fetch(`${API_BASE}/auth/register-volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volData)
    });
    return handleResponse(res);
  },

  async loginVolunteer(username, password) {
    const res = await fetch(`${API_BASE}/auth/login-volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(res);
  },

  // Donations
  async getDonations() {
    const res = await fetch(`${API_BASE}/donations`);
    return handleResponse(res);
  },

  async getDonationById(id) {
    const res = await fetch(`${API_BASE}/donations/${id}`);
    return handleResponse(res);
  },

  async createDonation(data) {
    const res = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateDonationStatus(id, status, extraData = {}, actor = 'System') {
    const res = await fetch(`${API_BASE}/donations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, extraData, actor })
    });
    return handleResponse(res);
  },

  // Volunteers
  async getVolunteers() {
    const res = await fetch(`${API_BASE}/volunteers`);
    return handleResponse(res);
  },

  async updateVolunteerStatus(id, status, notes = '') {
    const res = await fetch(`${API_BASE}/volunteers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    return handleResponse(res);
  },

  async updateVolunteerProfile(id, updatedFields) {
    const res = await fetch(`${API_BASE}/volunteers/${id}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });
    return handleResponse(res);
  },

  async toggleVolunteerAvailability(id) {
    const res = await fetch(`${API_BASE}/volunteers/${id}/availability`, {
      method: 'PATCH'
    });
    return handleResponse(res);
  },

  // Destinations
  async getDestinations() {
    const res = await fetch(`${API_BASE}/destinations`);
    return handleResponse(res);
  },

  async addDestination(data) {
    const res = await fetch(`${API_BASE}/destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Notifications
  async getNotifications(role = null) {
    const url = role ? `${API_BASE}/notifications?role=${role}` : `${API_BASE}/notifications`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async addNotification(notif) {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    });
    return handleResponse(res);
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return handleResponse(res);
  },

  async markAllNotificationsRead(role = null) {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return handleResponse(res);
  },

  // Corridors & Traffic
  async getCorridors() {
    const res = await fetch(`${API_BASE}/corridors`);
    return handleResponse(res);
  },

  async rerouteMission(donationId, bypassRouteName, corridorName, note) {
    const res = await fetch(`${API_BASE}/corridors/reroute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donationId, bypassRouteName, corridorName, note })
    });
    return handleResponse(res);
  },

  async broadcastAdvisory(corridorName, message) {
    const res = await fetch(`${API_BASE}/corridors/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corridorName, message })
    });
    return handleResponse(res);
  },

  // Sync offline/localStorage state to backend database
  async syncClientData(data) {
    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};
