# TrueNumber - Frontend

Application web Next.js pour le jeu TrueNumber.

## Prérequis

- Node.js (v18+ recommandé)
- Un backend TrueNumber fonctionnel (voir dossier `backend/`)

## Installation

```bash
cd frontend
npm install
```

## Configuration

Pour accéder à l’API backend, créez un fichier `.env.local` à la racine du dossier `frontend` :

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Adaptez l’URL si votre backend tourne sur une autre adresse ou un autre port.

## Scripts disponibles

- **Démarrer en développement** :
  ```bash
  npm run dev
  ```
- **Compiler l’application pour la production** :
  ```bash
  npm run build
  ```
- **Lancer le serveur Next.js en production** :
  ```bash
  npm start
  ```
- **Vérifier la qualité du code (lint)** :
  ```bash
  npm run lint
  ```

## Structure des dossiers

- `pages/` : pages principales de l’application (auth, jeu, historique, admin…)
- `components/` : composants réutilisables (ex : Layout)
- `hooks/` : hooks personnalisés (ex : useAuth)
- `services/` : appels à l’API backend

## Développement

- L’application est accessible sur [http://localhost:3000](http://localhost:3000) par défaut.
- Les appels à l’API utilisent l’URL définie dans `NEXT_PUBLIC_API_URL`.

## Déploiement

Vous pouvez déployer ce frontend sur Vercel, Netlify, ou tout autre hébergeur compatible Next.js.
