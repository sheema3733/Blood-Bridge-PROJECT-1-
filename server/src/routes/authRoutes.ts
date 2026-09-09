import { Router } from 'express';
import { register, login, getCurrentUser, demoLogin } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/demo-login', demoLogin);

export default router;
