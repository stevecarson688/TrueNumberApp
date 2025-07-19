import { Router } from 'express';
import { playGame } from '../controllers/game.controller';
import { authenticateJWT } from '../utils/jwt';

const router = Router();

// Lancer une partie (authentification requise)
router.post('/play', authenticateJWT, playGame);

export default router; 