import { fileDb } from '../data/fileDb.js';

export const syncClientData = async (req, res) => {
  try {
    const { donations, volunteers, destinations, donors } = req.body;

    if (Array.isArray(donations) && donations.length > 0) {
      const existing = fileDb.get('donations');
      donations.forEach(clientDonation => {
        const idx = existing.findIndex(d => d.id === clientDonation.id || d.publicReference === clientDonation.publicReference);
        if (idx >= 0) {
          existing[idx] = { ...existing[idx], ...clientDonation };
        } else {
          existing.unshift(clientDonation);
        }
      });
      fileDb.replace('donations', existing);
    }

    if (Array.isArray(volunteers) && volunteers.length > 0) {
      const existing = fileDb.get('volunteers');
      volunteers.forEach(v => {
        const idx = existing.findIndex(item => item.id === v.id);
        if (idx >= 0) existing[idx] = { ...existing[idx], ...v };
        else existing.push(v);
      });
      fileDb.replace('volunteers', existing);
    }

    if (Array.isArray(destinations) && destinations.length > 0) {
      const existing = fileDb.get('destinations');
      destinations.forEach(d => {
        const idx = existing.findIndex(item => item.id === d.id);
        if (idx >= 0) existing[idx] = { ...existing[idx], ...d };
        else existing.push(d);
      });
      fileDb.replace('destinations', existing);
    }

    res.json({
      success: true,
      message: 'Client state synchronized with database successfully!',
      stats: {
        donations: fileDb.get('donations').length,
        volunteers: fileDb.get('volunteers').length,
        destinations: fileDb.get('destinations').length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
