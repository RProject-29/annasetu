import express from 'express';
import {
  getCorridors,
  rerouteMission,
  broadcastAdvisory
} from '../controllers/corridorController.js';

const router = express.Router();

router.get('/', getCorridors);
router.post('/reroute', rerouteMission);
router.post('/broadcast', broadcastAdvisory);

export default router;
