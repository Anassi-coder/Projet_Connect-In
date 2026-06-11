#!/bin/sh
 echo "Attente de MySQL..."
  until php -r "new PDO('mysql:host=${DB_HOST};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');" 2>/dev/null; do
    echo "MySQL pas encore prêt, nouvelle tentative dans 2s..."
    sleep 2
  done
  echo "MySQL est prêt !"
  # Boucle until : essaie de se connecter à MySQL via PHP, réessaie toutes les 2 secondes jusqu'à succès.

  cd /var/www/html

  if [ ! -d "vendor" ]; then
    echo "Installation des dépendances Composer..."
    composer install --no-dev --optimize-autoloader
  fi
  # Si le dossier vendor/ n'existe pas (premier démarrage ou clone frais), on lance composer install.

  # Génère une APP_KEY si elle est vide (cas d'un clone frais avec .env.docker)
  php artisan key:generate --force

  php artisan migrate --force


  # Crée le lien storage -> public/storage
  php artisan storage:link || true

  exec php-fpm
  # Lance les migrations Laravel, puis démarre PHP-FPM. exec remplace le processus shell par php-fpm (bonne pratique Docker).