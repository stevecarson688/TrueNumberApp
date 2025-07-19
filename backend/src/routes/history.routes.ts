import { Router } from 'express';
import { getMyHistory, getAllHistory } from '../controllers/history.controller';
import { authenticateJWT } from '../utils/jwt';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Historique de l'utilisateur connecté
router.get('/', authenticateJWT, getMyHistory);

// Historique global (admin)
router.get('/all', authenticateJWT, requireAdmin, getAllHistory);

export default router; 