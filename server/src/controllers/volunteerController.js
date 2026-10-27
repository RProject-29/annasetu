import { fileDb } from '../data/fileDb.js';
import { getDBMode } from '../config/db.js';
import { UserModel } from '../models/User.js';

export const getVolunteers = async (req, res) => {
  try {
    if (getDBMode() === 'MONGODB') {
      const list = await UserModel.find({ role: 'VOLUNTEER' });
      return res.json(list);
    }
    const list = fileDb.get('volunteers');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes = '' } = req.body;

    if (getDBMode() === 'MONGODB') {
      const vol = await UserModel.findOne({ $or: [{ _id: id }, { id }] });
      if (!vol) return res.status(404).json({ error: 'Volunteer not found' });
      vol.status = status;
      if (status === 'VERIFIED_ACTIVE') vol.isAvailable = true;
      await vol.save();
      return res.json(vol);
    }

    const vol = fileDb.findById('volunteers', id);
    if (!vol) return res.status(404).json({ error: 'Volunteer not found' });

    const updated = fileDb.update('volunteers', id, {
      status,
      verificationNotes: notes,
      isAvailable: status === 'VERIFIED_ACTIVE' ? true : vol.isAvailable
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVolunteerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (getDBMode() === 'MONGODB') {
      const vol = await UserModel.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, updateFields, { new: true });
      if (!vol) return res.status(404).json({ error: 'Volunteer not found' });
      return res.json(vol);
    }

    const updated = fileDb.update('volunteers', id, updateFields);
    if (!updated) return res.status(404).json({ error: 'Volunteer not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleVolunteerAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBMode() === 'MONGODB') {
      const vol = await UserModel.findOne({ $or: [{ _id: id }, { id }] });
      if (!vol) return res.status(404).json({ error: 'Volunteer not found' });
      vol.isAvailable = !vol.isAvailable;
      await vol.save();
      return res.json(vol);
    }

    const vol = fileDb.findById('volunteers', id);
    if (!vol) return res.status(404).json({ error: 'Volunteer not found' });

    const updated = fileDb.update('volunteers', id, {
      isAvailable: !vol.isAvailable
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
