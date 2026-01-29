#!/bin/sh
set -e

# Wait for database to be ready (optional but recommended)
# if [ "$DB_CONNECTION" = "pgsql" ]; then
#   until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
#     echo "Waiting for database..."
#     sleep 2
#   done
# fi

echo "Running Artisan commands..."

# Ensure we are in the right directory
cd /var/www/html

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link --force

# Cache configuration and routes
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Artisan commands completed."

# Execute the main container command
exec "$@"
