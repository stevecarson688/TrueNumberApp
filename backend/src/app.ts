// Configuration principale de l'application Express
// Déclare les middlewares, routes et documentation Swagger
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import gameRoutes from './routes/game.routes';
import historyRoutes from './routes/history.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/swagger.json';

dotenv.config();

const app = express();

// Configuration CORS pour autoriser le frontend Vercel et localhost
const corsOptions = {
  origin: [
    'https://true-number-app-5bcm.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
};
app.use(cors(corsOptions));
// Middleware pour parser le JSON
app.use(express.json());

// Documentation Swagger accessible sur /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Déclaration des routes principales de l'API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/history', historyRoutes);

// Route de test pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.send('API TrueNumber opérationnelle');
});

export default app;
