import { Router } from 'express';
import {
  updateAvailability,
  getDonorDashboard,
  respondToMatch,
} from '../controllers/donorsController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/dashboard', requireRoles(['DONOR', 'ADMIN']), getDonorDashboard);
router.put('/availability', requireRoles(['DONOR', 'ADMIN']), updateAvailability);
router.post('/matches/:matchId/respond', requireRoles(['DONOR', 'ADMIN']), respondToMatch);

export default router;
