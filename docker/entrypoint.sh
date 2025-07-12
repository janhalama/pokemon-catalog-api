#!/bin/sh

# Docker entrypoint script for Pokemon Catalog API
# This script handles database setup, migrations, and auto-seeding pokemon

set -e

echo "Starting Pokemon Catalog API container..."

wait_for_database() {
  echo "Waiting for database to be ready..."
  until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
    echo "Database not ready yet, waiting..."
    sleep 2
  done
  echo "Database is ready!"
}

is_pokemon_table_empty() {
  local count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pokemon;" 2>/dev/null || echo "0")
  [ "$count" = "0" ]
}

run_migrations() {
  echo "Running database migrations..."
  yarn migrate
}

auto_seed_pokemon() {
  if is_pokemon_table_empty; then
    echo "Pokemon table is empty, seeding Pokemon data..."
    yarn seed:pokemon
  else
    echo "Pokemon table has data, skipping auto-seeding."
  fi
}

# Main execution
case "$1" in
  "setup")
    # Setup mode: run migrations and seeding
    wait_for_database
    run_migrations
    auto_seed_pokemon
    ;;
  "dev")
    # Development mode: setup then start dev server
    wait_for_database
    run_migrations
    auto_seed_pokemon
    echo "Starting development server..."
    exec yarn dev
    ;;
  "start")
    # Production mode: start the server
    wait_for_database
    echo "Starting production server..."
    exec yarn start
    ;;
  *)
    # Default: run the command as-is
    exec "$@"
    ;;
esac 