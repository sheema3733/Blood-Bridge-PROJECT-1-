import { Router } from 'express';
import {
  getStaffHandler,
  addStaffHandler,
  deleteStaffHandler,
} from '../controllers/hospitalStaffController';
import { authenticateToken, requireRoles } from '../middleware/auth';

export const hospitalStaffRoutes = Router();

hospitalStaffRoutes.get('/', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), getStaffHandler);
hospitalStaffRoutes.post('/', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), addStaffHandler);
hospitalStaffRoutes.delete('/:id', authenticateToken, requireRoles(['HOSPITAL', 'ADMIN']), deleteStaffHandler);
