import { Router } from 'express';
import {
  getDonorBadgesHandler,
  getLeaderboardHandler,
  getBadgeCatalogHandler,
} from '../controllers/badgeController';
import { authenticateToken } from '../middleware/auth';

export const badgeRoutes = Router();

badgeRoutes.get('/profile', authenticateToken, getDonorBadgesHandler);
badgeRoutes.get('/leaderboard', getLeaderboardHandler);
badgeRoutes.get('/catalog', getBadgeCatalogHandler);
