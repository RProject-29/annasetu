import { fileDb } from '../data/fileDb.js';
import { getDBMode } from '../config/db.js';
import { UserModel } from '../models/User.js';

export const registerDonor = async (req, res) => {
  try {
    const { name, phone, password, address, organization, donorType } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone, and password are required.' });
    }

    const username = (req.body.username || phone.replace(/[^0-9]/g, '') || name.toLowerCase().replace(/\s+/g, '')).trim();

    if (getDBMode() === 'MONGODB') {
      const existing = await UserModel.findOne({ $or: [{ username }, { phone }] });
      if (existing) {
        return res.status(400).json({ error: 'An account with this phone or username already exists.' });
      }

      const donor = await UserModel.create({
        name,
        username,
        password,
        phone,
        address,
        organization,
        donorType,
        role: 'DONOR'
      });

      return res.status(201).json({ success: true, donor });
    }

    // FileDB
    const donors = fileDb.get('donors');
    const existing = donors.find(d => d.phone === phone || (d.username && d.username.toLowerCase() === username.toLowerCase()));
    if (existing) {
      return res.status(400).json({ error: 'An account with this phone or username already exists.' });
    }

    const newDonor = fileDb.insert('donors', {
      name,
      username,
      password,
      phone,
      address: address || '',
      organization: organization || '',
      donorType: donorType || 'Individual Annadata',
      role: 'DONOR'
    });

    res.status(201).json({ success: true, donor: newDonor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginDonor = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Phone and password are required.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (getDBMode() === 'MONGODB') {
      const donor = await UserModel.findOne({
        role: 'DONOR',
        $or: [
          { username: cleanId },
          { phone: cleanId },
          { name: new RegExp(`^${cleanId}$`, 'i') }
        ]
      });

      if (!donor || donor.password !== cleanPass) {
        return res.status(401).json({ error: 'Invalid donor credentials. Please check your username/password.' });
      }

      return res.json({ success: true, donor });
    }

    // FileDB
    const donors = fileDb.get('donors');
    const matched = donors.find(d =>
      ((d.username && d.username.toLowerCase() === cleanId) ||
       (d.phone && d.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')) ||
       (d.name && d.name.toLowerCase() === cleanId)) &&
      d.password === cleanPass
    );

    if (!matched) {
      return res.status(401).json({ error: 'Invalid donor credentials. Please check your username/password.' });
    }

    res.json({ success: true, donor: matched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerVolunteer = async (req, res) => {
  try {
    const { name, phone, password, username, email, transportType, preferableRoute, serviceAreas, idDocumentType, idDocumentNumber, idDocumentPreview } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone, and password are required.' });
    }

    const cleanUser = (username || name.toLowerCase().replace(/\s+/g, '')).trim();

    const volunteerPayload = {
      name,
      username: cleanUser,
      password,
      phone,
      email: email || '',
      role: 'VOLUNTEER',
      status: 'PENDING',
      transportType: transportType || 'Two-Wheeler (with insulated crate)',
      preferableRoute: preferableRoute || 'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board',
      serviceAreas: serviceAreas || ['Indiranagar', 'Koramangala'],
      isAvailable: false,
      idDocumentType: idDocumentType || 'Govt ID',
      idDocumentNumber: idDocumentNumber || 'DOC-2026-9481',
      idDocumentPreview: idDocumentPreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60',
      completedRescues: 0,
      mealsDistributed: 0,
      rating: 5.0,
      rewardPoints: 100,
      tier: 'Registered Novice',
      badges: [{ id: 'b0', title: 'Registered Volunteer', icon: '🌱', desc: 'Completed background registration & ID upload' }]
    };

    if (getDBMode() === 'MONGODB') {
      const vol = await UserModel.create(volunteerPayload);
      return res.status(201).json({ success: true, volunteer: vol });
    }

    const vol = fileDb.insert('volunteers', volunteerPayload);
    res.status(201).json({ success: true, volunteer: vol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginVolunteer = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (getDBMode() === 'MONGODB') {
      const vol = await UserModel.findOne({
        role: 'VOLUNTEER',
        $or: [{ username: cleanUser }, { phone: cleanUser }]
      });

      if (!vol || vol.password !== cleanPass) {
        return res.status(401).json({ error: 'Invalid volunteer credentials.' });
      }

      return res.json({ success: true, volunteer: vol });
    }

    const volunteers = fileDb.get('volunteers');
    const matched = volunteers.find(v =>
      ((v.username && v.username.toLowerCase() === cleanUser) ||
       (v.phone && v.phone.replace(/[^0-9]/g, '') === cleanUser.replace(/[^0-9]/g, ''))) &&
      v.password === cleanPass
    );

    if (!matched) {
      return res.status(401).json({ error: 'Invalid volunteer credentials.' });
    }

    res.json({ success: true, volunteer: matched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
