import express from 'express';
import { syncClientData } from '../controllers/syncController.js';

const router = express.Router();

router.post('/', syncClientData);

export default router;
