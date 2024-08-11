import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserAppointments } from '../controllers/UserController.js';

const router = express.Router();

router.route('/:user/appointments')
    .get(authMiddleware, getUserAppointments);

export default router;