#!/bin/sh
set -e

echo "Running migrations..."
yarn db:migrate

echo "Starting API with hot reload..."
exec yarn dev
