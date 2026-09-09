import { Router } from 'express';
import {
  registerWebhookHandler,
  getDeliveriesHandler,
  testWebhookDispatchHandler,
} from '../controllers/webhookController';
import { authenticateToken, requireRoles } from '../middleware/auth';

export const webhookRoutes = Router();

webhookRoutes.post('/', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), registerWebhookHandler);
webhookRoutes.get('/deliveries/:subscriptionId', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), getDeliveriesHandler);
webhookRoutes.post('/test', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), testWebhookDispatchHandler);
