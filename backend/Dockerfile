# Laravel — development image (PHP 8.4 FPM + artisan serve)
FROM php:8.4-fpm-alpine

# System deps
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    postgresql-dev \
    oniguruma-dev \
    $PHPIZE_DEPS

# PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip gd bcmath \
    && pecl install redis \
    && docker-php-ext-enable redis

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps first for caching (source is bind-mounted in compose)
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
