#!/bin/sh
set -e

echo "Installing dependencies..."
yarn install --frozen-lockfile

echo "Running migrations..."
yarn db:migrate

echo "Starting API with hot reload..."
exec yarn dev
