import express from 'express';
import { register, login, getMe, getUsers, deleteUser } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('ADMIN'), getUsers);
router.delete('/users/:id', protect, authorize('ADMIN'), deleteUser);

export default router;
