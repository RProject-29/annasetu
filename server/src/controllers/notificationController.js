import { fileDb } from '../data/fileDb.js';
import { getDBMode } from '../config/db.js';
import { NotificationModel } from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { role } = req.query;
    if (getDBMode() === 'MONGODB') {
      const filter = role ? { $or: [{ forRole: role }, { forRole: { $exists: false } }] } : {};
      const list = await NotificationModel.find(filter).sort({ timestamp: -1 });
      return res.json(list);
    }
    const list = fileDb.get('notifications');
    const filtered = role ? list.filter(n => !n.forRole || n.forRole === role) : list;
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { forRole, title, message, donationId, volunteerId } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }

    const notifData = {
      forRole,
      title,
      message,
      donationId,
      volunteerId,
      read: false,
      timestamp: new Date().toISOString()
    };

    if (getDBMode() === 'MONGODB') {
      const created = await NotificationModel.create(notifData);
      return res.status(201).json(created);
    }

    const created = fileDb.insert('notifications', notifData);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBMode() === 'MONGODB') {
      await NotificationModel.findByIdAndUpdate(id, { read: true });
      return res.json({ success: true });
    }
    fileDb.update('notifications', id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const { role } = req.body;
    if (getDBMode() === 'MONGODB') {
      const filter = role ? { forRole: role } : {};
      await NotificationModel.updateMany(filter, { read: true });
      return res.json({ success: true });
    }
    const list = fileDb.get('notifications');
    list.forEach(n => {
      if (!role || n.forRole === role) n.read = true;
    });
    fileDb.replace('notifications', list);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
