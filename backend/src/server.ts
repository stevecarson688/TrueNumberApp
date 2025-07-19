// Point d'entrée du serveur Express
// Initialise la connexion à la base de données et démarre l'application
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

// Fonction principale pour lancer le serveur
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer();
