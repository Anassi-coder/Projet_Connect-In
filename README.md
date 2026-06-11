# Connect'In - Réseau Social Collaboratif

Connect'In est une plateforme de réseau social moderne permettant aux utilisateurs de partager des publications, d'interagir via des commentaires et des mentions "J'aime", et de gérer leur profil personnel. Le projet est entièrement conteneurisé avec Docker pour garantir un environnement de développement identique pour tous les collaborateurs.

## Architecture Technique

Le projet repose sur une architecture découplée pour séparer les responsabilités :

Frontend : Interface riche développée en HTML5, JavaScript (Vanilla ES6+) et stylisée avec Tailwind CSS.

Backend : API RESTful robuste propulsée par Laravel (PHP).

Infrastructure : Orchestration multi-conteneurs via Docker Compose.

Base de données : Système de gestion de base de données MySQL.

Serveur Web : Nginx configuré comme reverse proxy pour servir le frontend et l'API.

## Structure du Projet

```text
.
├── connectin-api/    # Backend Laravel (Modèles, Contrôleurs, Migrations)
├── frontend/         # Interface Utilisateur (Vite/Tailwind)
│   ├── src/          # Sources CSS et configuration Tailwind
│   ├── index.html    # Page d'accueil / Connexion
│   ├── profil.js     # Logique du profil et flux de publications
│   └── accueil.js    # Gestion de l'affichage des posts
├── docker/           # Config spécifiques (Nginx, PHP, MySQL)
└── docker-compose.yml # Orchestration des services

```


## Installation et Lancement

**1.Prérequis**

Avoir installé Docker et Docker Compose.

Avoir Node.js installé localement (recommandé pour la compilation CSS).

**2. Démarrage de l'infrastructure**

Lancez les conteneurs depuis la racine du projet :

Bash : 
docker compose up -d --build

Cela initialise les services connectin_app (PHP), connectin_nginx (Web) et connectin_db (Base de données).

**3. Configuration du Backend**

Exécutez les migrations pour créer les tables de la base de données :

Bash : 
docker exec -it connectin_app php artisan migrate --seed

**4. Compilation du CSS (Tailwind)**

Pour que les styles s'affichent correctement, compilez le CSS depuis le dossier frontend :

Bash
cd frontend
npm install
npx tailwindcss -i ./src/css/input.css -o ./src/css/output.css --watch


## Fonctionnalités

**Authentification :** Sécurisée par Token JWT stocké dans le localStorage.

**Profil Utilisateur :** Affichage et modification des informations (Bio, Localisation, etc.).

**Système d'onglets pour filtrer :** Mes Posts, Mes Commentaires, Mes Likes.

**Publications :** Création et édition avec support d'images et 
suppression de contenu personnel.

**Interactions :** Système de likes et gestion complète des commentaires.

**Design :** Interface totalement responsive avec menu burger et barre de recherche mobile.