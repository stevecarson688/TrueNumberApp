# TrueNumber - Backend

## Prérequis

- Node.js (v18+ recommandé)
- MongoDB (local ou distant)
- Un fichier `.env` à la racine du dossier `backend` (voir variables ci-dessous)

## Installation

```bash
cd backend
npm install
```

## Variables d’environnement

Créez un fichier `.env` dans le dossier `backend` avec au minimum :

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

## Scripts disponibles

- **Démarrer en développement** (TypeScript à la volée) :
  ```bash
  npm run dev
  ```
- **Compiler le projet** (TypeScript → JavaScript dans `dist/`) :
  ```bash
  npm run build
  ```
- **Lancer le serveur compilé** :
  ```bash
  node dist/server.js
  ```

## Structure des dossiers

- `src/` : code source TypeScript
  - `controllers/`, `models/`, `routes/`, `middlewares/`, `utils/`, `config/`
  - `scripts/` : scripts utilitaires (ex : promotion admin)
- `dist/` : code compilé (ne pas modifier à la main)
- `swagger/` : documentation OpenAPI (Swagger)

## Documentation API

Une documentation interactive est disponible après lancement du serveur sur :  
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Script utilitaire : Promotion d’un utilisateur en admin

Pour promouvoir un utilisateur au rôle admin :

```bash
npx ts-node src/scripts/promoteToAdmin.ts <email>
```
- `<email>` : l’email de l’utilisateur à promouvoir (par défaut : `stevecarson195@gmail.com` si non précisé)
