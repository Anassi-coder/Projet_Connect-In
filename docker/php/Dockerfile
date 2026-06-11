FROM php:8.2-fpm-alpine 
# image de base
RUN apk add --no-cache git curl libpng-dev libzip-dev zip unzip oniguruma-dev
# gestionnaire de paquets Alpine. installation dépendance PHP 
RUN docker-php-ext-install pdo_mysql mbstring bcmath zip gd
# compilation des extensions PHP :PDO_mysql pour parler avec MySQL, mbstring pour l'encodage, , bcmath pour les arrondi
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
#Copie de Composer depuis son image officielle
 WORKDIR /var/www/html
  EXPOSE 9000
  # Le dossier de travail dans le container. Port 9000 = port par défaut de PHP-FPM.
COPY docker/php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
#On copie notre script de démarrage et on le rend exécutable.