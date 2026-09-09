import { Router } from 'express';
import {
  getPreferencesHandler,
  updatePreferencesHandler,
  testAlertEligibilityHandler,
} from '../controllers/donorPreferencesController';
import { authenticateToken, requireRoles } from '../middleware/auth';

export const donorPreferencesRoutes = Router();

donorPreferencesRoutes.get('/', authenticateToken, requireRoles(['DONOR', 'ADMIN']), getPreferencesHandler);
donorPreferencesRoutes.put('/', authenticateToken, requireRoles(['DONOR', 'ADMIN']), updatePreferencesHandler);
donorPreferencesRoutes.post('/test-alert', authenticateToken, requireRoles(['DONOR', 'ADMIN']), testAlertEligibilityHandler);
