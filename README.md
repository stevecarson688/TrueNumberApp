# TrueNumber

**TrueNumber** est une application fullstack (Node.js/Express/MongoDB + Next.js/Chakra UI) permettant de jouer à un jeu de hasard, de gérer son compte utilisateur, et d'administrer les utilisateurs via une interface moderne, fluide et responsive.

## 🚀 Fonctionnalités principales

- Authentification JWT (inscription, connexion, déconnexion)
- Jeu TrueNumber (nombre aléatoire, solde, victoire/défaite)
- Historique des parties
- Interface Admin (gestion des utilisateurs, rôles)
- API RESTful documentée via Swagger
- Design moderne & responsive (Chakra UI)

## 🛠️ Stack technique

- **Backend** : Node.js, Express, TypeScript, MongoDB, JWT, Swagger
- **Frontend** : Next.js, TypeScript, Chakra UI

## 📦 Installation & Lancement

### Prérequis

- Node.js >= 18
- npm >= 8
- MongoDB (local ou cloud)

### 1. Cloner le dépôt

```bash
git clone <lien-du-repo>
cd tuenumber
```

### 2. Backend

Voir le fichier [`backend/README.md`](./backend/README.md) pour toutes les instructions détaillées (installation, configuration, scripts, promotion admin…).

Résumé rapide :
```bash
cd backend
npm install
# Créez un fichier .env avec MONGODB_URI et PORT
npm run dev
```
- API sur `http://localhost:5000`
- Swagger : `http://localhost:5000/api-docs`

### 3. Frontend

Voir le fichier [`frontend/README.md`](./frontend/README.md) pour toutes les instructions détaillées (installation, configuration, scripts…).

Résumé rapide :
```bash
cd frontend
npm install
npm run dev
```
- Application sur `http://localhost:3000`

## ⚙️ Configuration

- **backend/.env** :
  ```
  MONGODB_URI=mongodb://localhost:27017/truenumber
  PORT=5000
  ```
- **frontend/.env.local** :
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  ```

## 📝 Structure du projet

```
tuenumber/
├── backend/
│   ├── src/
│   ├── dist/
│   ├── swagger/
│   └── ...
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── ...
└── README.md
```

## 🔒 Sécurité & Bonnes pratiques

- Authentification JWT, vérification des rôles (admin/client)
- Hash des mots de passe (bcrypt)
- Validation des entrées côté backend
- Séparation claire frontend/backend
- Code commenté, structuré, maintenable

## 🌐 Déploiement

- **Backend** : Heroku, Render, Railway, etc.
- **Frontend** : Vercel, Netlify, etc.
- **MongoDB** : local ou cloud (MongoDB Atlas recommandé)

## 📚 Liens utiles

- [Swagger API Docs](http://localhost:5000/api-docs)
- [Chakra UI](https://chakra-ui.com/)
- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

## 👨‍💻 Auteur

- TCHAO ZIWA BILL STEVE  
  Tel: 657917076  
  Email: stevecarson195@gmail.com

---

**N'hésitez pas à contribuer, à signaler des bugs ou à proposer des améliorations !** 