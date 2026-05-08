#!/bin/bash
set -e

REPO="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/opt/homebrew/opt/postgresql@16/bin:/opt/homebrew/bin:~/.npm-global/bin:$PATH"

log() { echo "▶ $*"; }
ok()  { echo "✓ $*"; }

# ─── PostgreSQL ──────────────────────────────────────────────────────────────
log "PostgreSQL..."
if ! pg_isready -q 2>/dev/null; then
  brew services start postgresql@16
  until pg_isready -q 2>/dev/null; do sleep 1; done
fi
ok "PostgreSQL ready"

# ─── Colima (Docker) ─────────────────────────────────────────────────────────
log "Colima..."
if ! colima status 2>/dev/null | grep -q "running"; then
  colima start --cpu 2 --memory 4 --disk 20
fi
export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock
ok "Docker ready"

# ─── Sandbox service ─────────────────────────────────────────────────────────
log "Sandbox service..."
if ! curl -s http://localhost:8080/health 2>/dev/null | grep -q "ok"; then
  pkill -f sandbox-service 2>/dev/null || true
  cd "$REPO/apps/compiler"
  [ ! -f sandbox-service ] && go build -o sandbox-service ./cmd/server
  DOCKER_HOST=unix://$HOME/.colima/default/docker.sock \
    EXECUTION_TIMEOUT_MS=30000 \
    MAX_CONCURRENT_EXECUTIONS=5 \
    "$REPO/apps/compiler/sandbox-service" >> /tmp/codenexus-sandbox.log 2>&1 &
  until curl -s http://localhost:8080/health 2>/dev/null | grep -q "ok"; do sleep 1; done
fi
ok "Sandbox ready on :8080"

# ─── Next.js ─────────────────────────────────────────────────────────────────
log "Starting Next.js dev server..."
cd "$REPO"
DATABASE_URL="postgresql://codenexus:codenexus_dev_password@localhost:5432/codenexus" \
  pnpm --filter web dev
