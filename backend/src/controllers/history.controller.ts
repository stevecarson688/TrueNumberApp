import { Request, Response } from 'express';
import Game from '../models/game.model';

// Historique de l'utilisateur connecté
export const getMyHistory = async (req: any, res: Response) => {
  try {
    const games = await Game.find({ user: req.user.id }).sort({ date: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Historique de tous les utilisateurs (admin)
export const getAllHistory = async (_req: Request, res: Response) => {
  try {
    const games = await Game.find().populate('user', 'username email').sort({ date: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}; 