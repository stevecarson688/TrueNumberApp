import { Request, Response } from 'express';
import Game from '../models/game.model';
import User from '../models/user.model';

// Lancer une partie du jeu TrueNumber
export const playGame = async (req: any, res: Response) => {
  try {
    // Générer un nombre aléatoire entre 0 et 100
    const generatedNumber = Math.floor(Math.random() * 101);
    let result: 'gagné' | 'perdu';
    let balanceChange = 0;

    if (generatedNumber <= 70) {
      result = 'perdu';
      balanceChange = -35;
    } else {
      result = 'gagné';
      balanceChange = 50;
    }

    // Mettre à jour le solde utilisateur
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    user.balance += balanceChange;
    await user.save();

    // Enregistrer la partie
    const game = await Game.create({
      user: user._id,
      generatedNumber,
      result,
      balanceChange,
      newBalance: user.balance,
    });

    res.status(201).json({
      result,
      generatedNumber,
      newBalance: user.balance,
      gameId: game._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}; 