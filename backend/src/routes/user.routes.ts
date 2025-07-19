import { Router } from 'express';
import {
  getMe,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller';
import { authenticateJWT } from '../utils/jwt';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Récupérer son propre profil (authentifié)
router.get('/me', authenticateJWT, getMe);

// Routes admin uniquement
router.get('/', authenticateJWT, requireAdmin, getAllUsers);
router.get('/:id', authenticateJWT, requireAdmin, getUserById);
router.post('/', authenticateJWT, requireAdmin, createUser);
router.put('/:id', authenticateJWT, requireAdmin, updateUser);
router.delete('/:id', authenticateJWT, requireAdmin, deleteUser);

export default router; 