import { Router } from 'express';
import {
  getAdminOverview,
  getDuplicateReviewQueue,
  getUsersList,
  updateUserStatus,
  getAuditLogs,
} from '../controllers/adminController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireRoles(['ADMIN']));

router.get('/overview', getAdminOverview);
router.get('/duplicates', getDuplicateReviewQueue);
router.get('/users', getUsersList);
router.patch('/users/:userId/status', updateUserStatus);
router.get('/audit-logs', getAuditLogs);

export default router;
