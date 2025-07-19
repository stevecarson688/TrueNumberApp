import { Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/jwt';

export const requireRole = (role: 'admin' | 'client') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Accès interdit : rôle insuffisant.' });
    }
    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireClient = requireRole('client'); 