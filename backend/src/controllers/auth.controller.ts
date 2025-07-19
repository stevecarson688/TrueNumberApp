import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Générer un JWT
function generateToken(user: IUser) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      balance: user.balance
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Inscription
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email ou username déjà utilisé.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role: 'client',
      balance: 0,
    });
    return res.status(201).json({ message: 'Compte créé avec succès', user: { id: user._id, username: user.username, email: user.email, phone: user.phone, role: user.role, balance: user.balance } });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Connexion
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }
    const token = generateToken(user);
    return res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, phone: user.phone, role: user.role, balance: user.balance } });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Déconnexion (stateless, côté client)
export const logout = async (_req: Request, res: Response) => {
  // Pour JWT stateless, la déconnexion se fait côté client (suppression du token)
  return res.status(200).json({ message: 'Déconnecté avec succès.' });
};

// Mot de passe oublié : envoi du lien de reset
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'Si cet email existe, un lien a été envoyé.' });

  const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  user.resetToken = resetToken;
  await user.save();

  // Configure ton transporteur selon ton fournisseur d'email
  // Ici, exemple pour développement (mailtrap, etc.)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    to: user.email,
    subject: 'Réinitialisation de mot de passe',
    html: `<a href="http://localhost:3000/reset-password?token=${resetToken}">Réinitialiser mon mot de passe</a>`
  });

  res.json({ message: 'Si cet email existe, un lien a été envoyé.' });
};

// Réinitialisation effective du mot de passe
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(payload.userId);
    if (!user || user.resetToken !== token) return res.status(400).json({ message: 'Lien invalide ou expiré.' });
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    await user.save();
    res.json({ message: 'Mot de passe réinitialisé.' });
  } catch (e) {
    res.status(400).json({ message: 'Lien invalide ou expiré.' });
  }
}; 