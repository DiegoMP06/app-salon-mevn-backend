import express from "express";
import { createAppointment, getAppointmentsByDate, getAppointment, updateAppointment, deleteAppointment } from "../controllers/AppointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/')
    .get(authMiddleware, getAppointmentsByDate)
    .post(authMiddleware, createAppointment);

router.route('/:id')
    .get(authMiddleware, getAppointment)
    .put(authMiddleware, updateAppointment)
    .delete(authMiddleware, deleteAppointment);

export default router;