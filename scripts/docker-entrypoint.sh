#!/bin/sh
set -e

echo "Running migrations..."
yarn db:migrate

echo "Starting API..."
exec node dist/index.js
