import { Router } from 'express';
import { evaluateScreeningHandler } from '../controllers/healthScreeningController';
import { authenticateToken } from '../middleware/auth';

export const healthScreeningRoutes = Router();

// Allow authenticated users (and optionally donors) to self-screen before accepting dispatch
healthScreeningRoutes.post('/evaluate', authenticateToken, evaluateScreeningHandler);
