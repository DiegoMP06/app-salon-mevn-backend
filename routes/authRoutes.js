import express from "express";
import { register, verifyAcount, login, user, forgotPassword, verifyPasswordResetToken, updatePassword, admin } from '../controllers/AuthController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verifyAcount);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.route('/forgot-password/:token')
    .get(verifyPasswordResetToken)
    .post(updatePassword);

router.get('/user', authMiddleware, user);
router.get('/admin', authMiddleware, admin);

export default router;