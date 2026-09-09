import { Router } from 'express';
import {
  listHospitals,
  getHospitalDashboard,
  verifyBloodRequest,
} from '../controllers/hospitalsController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// Public listing for request dropdowns
router.get('/', listHospitals);

// Protected hospital routes
router.get('/dashboard', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), getHospitalDashboard);
router.post('/requests/:requestId/verify', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), verifyBloodRequest);

export default router;
