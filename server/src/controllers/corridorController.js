import { fileDb } from '../data/fileDb.js';

export const getCorridors = async (req, res) => {
  try {
    const corridors = fileDb.get('corridors');
    res.json(corridors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rerouteMission = async (req, res) => {
  try {
    const { donationId, corridorName, bypassRouteName, note } = req.body;
    if (!donationId || !bypassRouteName) {
      return res.status(400).json({ error: 'donationId and bypassRouteName are required.' });
    }

    const donation = fileDb.findById('donations', donationId);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const timelineEntry = {
      status: 'DISTRIBUTION_IN_PROGRESS',
      timestamp: new Date().toISOString(),
      actor: 'Admin Traffic Command',
      note: note || `Diverted via ${bypassRouteName} to bypass traffic jam on ${corridorName}.`
    };

    const updated = fileDb.update('donations', donationId, {
      reroutedVia: bypassRouteName,
      status: 'DISTRIBUTION_IN_PROGRESS',
      timeline: [...(donation.timeline || []), timelineEntry]
    });

    // Also add notification for volunteer
    fileDb.insert('notifications', {
      forRole: 'VOLUNTEER',
      title: 'Navigation Route Updated by Admin',
      message: `Silk Board traffic high. Please take ${bypassRouteName} bypass for rescue #${donation.publicReference}.`,
      donationId,
      read: false,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, donation: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const broadcastAdvisory = async (req, res) => {
  try {
    const { corridorName, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const notif = fileDb.insert('notifications', {
      forRole: 'VOLUNTEER',
      title: `Traffic Advisory: ${corridorName || 'City Corridors'}`,
      message,
      read: false,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
