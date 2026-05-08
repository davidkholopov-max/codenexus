-- CodeNexus database initialization
-- Prisma handles all schema migrations via `pnpm db:migrate`
-- This file just ensures the DB and extensions exist

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
