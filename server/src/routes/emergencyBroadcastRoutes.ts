import { Router } from 'express';
import {
  getActiveBroadcastsHandler,
  issueBroadcastHandler,
  revokeBroadcastHandler,
} from '../controllers/emergencyBroadcastController';
import { authenticateToken, requireRoles } from '../middleware/auth';

export const emergencyBroadcastRoutes = Router();

// Publicly readable for active alerts
emergencyBroadcastRoutes.get('/active', getActiveBroadcastsHandler);

// Admin-only dispatch and revoke
emergencyBroadcastRoutes.post('/', authenticateToken, requireRoles(['ADMIN']), issueBroadcastHandler);
emergencyBroadcastRoutes.post('/:id/revoke', authenticateToken, requireRoles(['ADMIN']), revokeBroadcastHandler);
