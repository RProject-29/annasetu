import { fileDb } from '../data/fileDb.js';
import { getDBMode } from '../config/db.js';
import { DonationModel } from '../models/Donation.js';

export const getDonations = async (req, res) => {
  try {
    if (getDBMode() === 'MONGODB') {
      const list = await DonationModel.find().sort({ createdAt: -1 });
      return res.json(list);
    }
    const list = fileDb.get('donations');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBMode() === 'MONGODB') {
      const item = await DonationModel.findOne({ $or: [{ _id: id }, { id }, { publicReference: id }] });
      if (!item) return res.status(404).json({ error: 'Donation not found' });
      return res.json(item);
    }
    const item = fileDb.findById('donations', id) || fileDb.get('donations').find(d => d.publicReference === id);
    if (!item) return res.status(404).json({ error: 'Donation not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDonation = async (req, res) => {
  try {
    const {
      foodDescription,
      foodType,
      quantityMeals,
      eventType,
      makingTime,
      freshnessHours,
      pickupAddress,
      pickupLandmark,
      donorName,
      donorPhone,
      donorOrg,
      donorLiveLocation,
      foodPhoto
    } = req.body;

    if (!foodDescription || !quantityMeals || !pickupAddress || !donorName || !donorPhone) {
      return res.status(400).json({ error: 'Food description, quantity, address, donor name, and phone are required.' });
    }

    const publicReference = `AS-${Math.floor(100 + Math.random() * 900)}`;
    const freshness = Number(freshnessHours) || 4;
    const safeConsumptionDeadline = new Date(Date.now() + freshness * 60 * 60 * 1000).toISOString();

    const donationData = {
      publicReference,
      foodDescription,
      foodType: foodType || 'Cooked Meal',
      quantityMeals: Number(quantityMeals),
      eventType: eventType || 'Community Surplus',
      makingTime: makingTime || 'Freshly Prepared',
      freshnessHours: freshness,
      safeConsumptionDeadline,
      pickupAddress,
      pickupLandmark: pickupLandmark || '',
      donorName,
      donorPhone,
      donorOrg: donorOrg || '',
      donorLiveLocation: donorLiveLocation || '',
      foodPhoto: foodPhoto || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          actor: `Donor (${donorName})`,
          note: `Reported ${quantityMeals} meals for redistribution. Deadline: ${new Date(safeConsumptionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
        }
      ]
    };

    if (getDBMode() === 'MONGODB') {
      const created = await DonationModel.create(donationData);
      return res.status(201).json(created);
    }

    const created = fileDb.insert('donations', donationData);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, extraData = {}, actor = 'System' } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const timelineEntry = {
      status,
      timestamp: new Date().toISOString(),
      actor,
      note: extraData.statusNote || `Status updated to ${status}.`
    };

    if (getDBMode() === 'MONGODB') {
      const existing = await DonationModel.findOne({ $or: [{ _id: id }, { id }] });
      if (!existing) return res.status(404).json({ error: 'Donation not found' });

      existing.status = status;
      Object.assign(existing, extraData);
      existing.timeline.push(timelineEntry);
      if (status === 'COMPLETED') existing.completedAt = new Date();

      await existing.save();
      return res.json(existing);
    }

    const donation = fileDb.findById('donations', id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const updated = {
      ...donation,
      ...extraData,
      status,
      timeline: [...(donation.timeline || []), timelineEntry]
    };

    if (status === 'COMPLETED') updated.completedAt = new Date().toISOString();

    fileDb.update('donations', id, updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
