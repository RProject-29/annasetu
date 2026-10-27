import { fileDb } from '../data/fileDb.js';
import { getDBMode } from '../config/db.js';
import { DestinationModel } from '../models/Destination.js';

export const getDestinations = async (req, res) => {
  try {
    if (getDBMode() === 'MONGODB') {
      const list = await DestinationModel.find({ active: true });
      return res.json(list);
    }
    const list = fileDb.get('destinations');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addDestination = async (req, res) => {
  try {
    const { name, type, address, contactPerson, contactPhone, capacityMeals } = req.body;
    if (!name || !address || !contactPerson || !contactPhone) {
      return res.status(400).json({ error: 'Name, address, contact person, and phone are required.' });
    }

    const destData = {
      name,
      type: type || 'Night Shelter & Community Kitchen',
      address,
      contactPerson,
      contactPhone,
      capacityMeals: Number(capacityMeals) || 200,
      active: true
    };

    if (getDBMode() === 'MONGODB') {
      const created = await DestinationModel.create(destData);
      return res.status(201).json(created);
    }

    const created = fileDb.insert('destinations', destData);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
