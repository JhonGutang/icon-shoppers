# Base image
FROM php:8.3-fpm-alpine

# Arguments
ARG user=www-data
ARG uid=1000

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    curl \
    oniguruma-dev \
    postgresql-dev \
    icu-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_pgsql mbstring zip exif pcntl gd bcmath intl opcache

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy configurations
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 80

# Entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
