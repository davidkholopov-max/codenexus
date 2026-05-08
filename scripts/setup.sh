#!/bin/bash
# CodeNexus — Initial setup script
set -e

echo "🚀 Setting up CodeNexus..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js 20+ required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm required (npm i -g pnpm)"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }
command -v go >/dev/null 2>&1 || echo "⚠️  Go not found — compiler service won't build locally (Docker will handle it)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy env files
if [ ! -f apps/web/.env.local ]; then
  cp apps/web/.env.local.example apps/web/.env.local
  echo "⚙️  Created apps/web/.env.local — edit NEXTAUTH_SECRET and OAuth keys"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm --filter database generate

# Start Docker services
echo "🐳 Starting PostgreSQL and Redis..."
docker compose -f docker/docker-compose.yml up -d postgres redis

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec codenexus-db pg_isready -U codenexus > /dev/null 2>&1; do
  sleep 1
done
echo "  ✓ PostgreSQL ready"

# Run migrations
echo "🗄️  Running database migrations..."
pnpm db:migrate

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed

# Build Docker runner images
echo "🏗️  Building code execution runner images..."
docker build -t codenexus-runner-python:latest docker/sandbox/runners/python/ \
  && echo "  ✓ Python runner" \
  || echo "  ⚠ Python runner: skipped"

docker build -t codenexus-runner-node:latest docker/sandbox/runners/node/ \
  && echo "  ✓ Node.js runner" \
  || echo "  ⚠ Node.js runner: skipped"

docker build -t codenexus-runner-go:latest docker/sandbox/runners/go/ \
  && echo "  ✓ Go runner" \
  || echo "  ⚠ Go runner: skipped"

docker build -t codenexus-runner-cpp:latest docker/sandbox/runners/cpp/ \
  && echo "  ✓ C++ runner" \
  || echo "  ⚠ C++ runner: skipped"

docker build -t codenexus-runner-java:latest docker/sandbox/runners/java/ \
  && echo "  ✓ Java runner" \
  || echo "  ⚠ Java runner: skipped"

docker build -t codenexus-runner-sqlite:latest docker/sandbox/runners/sqlite/ \
  && echo "  ✓ SQLite runner" \
  || echo "  ⚠ SQLite runner: skipped"

# Start compiler sandbox
echo "🧰 Building and starting compiler sandbox..."
docker compose -f docker/docker-compose.yml up -d sandbox \
  && echo "  ✓ Compiler sandbox running on :8080" \
  || echo "  ⚠ Compiler sandbox: check docker logs codenexus-sandbox"

echo ""
echo "✅ CodeNexus is ready!"
echo ""
echo "  pnpm dev:web          →  http://localhost:3000"
echo "  pnpm dev:compiler     →  (if running locally without Docker)"
echo "  pnpm db:studio        →  http://localhost:5555 (Prisma Studio)"
echo ""
echo "To stop all services:"
echo "  docker compose -f docker/docker-compose.yml down"
