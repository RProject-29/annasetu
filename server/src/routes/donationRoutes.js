import express from 'express';
import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonationStatus
} from '../controllers/donationController.js';

const router = express.Router();

router.get('/', getDonations);
router.post('/', createDonation);
router.get('/:id', getDonationById);
router.patch('/:id/status', updateDonationStatus);

export default router;
