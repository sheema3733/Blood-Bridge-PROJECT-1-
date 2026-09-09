import { Router } from 'express';
import {
  submitFeedbackHandler,
  getDonorFeedbackHandler,
} from '../controllers/feedbackController';
import { authenticateToken, requireRoles } from '../middleware/auth';

export const feedbackRoutes = Router();

feedbackRoutes.post('/', authenticateToken, requireRoles(['REQUESTER', 'HOSPITAL', 'ADMIN']), submitFeedbackHandler);
feedbackRoutes.get('/donor/:donorId', getDonorFeedbackHandler);
