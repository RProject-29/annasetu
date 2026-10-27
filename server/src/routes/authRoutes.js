import express from 'express';
import {
  registerDonor,
  loginDonor,
  registerVolunteer,
  loginVolunteer
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register-donor', registerDonor);
router.post('/login-donor', loginDonor);
router.post('/register-volunteer', registerVolunteer);
router.post('/login-volunteer', loginVolunteer);

export default router;
