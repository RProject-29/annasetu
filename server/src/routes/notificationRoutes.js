import express from 'express';
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllRead);

export default router;
