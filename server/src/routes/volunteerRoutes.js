import express from 'express';
import {
  getVolunteers,
  updateVolunteerStatus,
  updateVolunteerProfile,
  toggleVolunteerAvailability
} from '../controllers/volunteerController.js';

const router = express.Router();

router.get('/', getVolunteers);
router.patch('/:id/status', updateVolunteerStatus);
router.patch('/:id/profile', updateVolunteerProfile);
router.patch('/:id/availability', toggleVolunteerAvailability);

export default router;
