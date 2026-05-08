# CodeNexus — Development Log

## Project Overview
Educational platform for programmers with interactive code execution, progress tracking, and multilingual support.

**Status**: 🚧 Active Development
**Started**: 2026-05-07
**Stack**: Next.js 14 · Node.js · Go · PostgreSQL · Docker · Prisma

---

## Architecture Decisions

### Monorepo Structure
- `apps/web` — Next.js 14 frontend (App Router)
- `apps/compiler` — Go-based code execution service
- `packages/database` — Prisma schema + migrations (shared)
- `packages/types` — Shared TypeScript types
- `services/auth-service` — JWT + OAuth (Node.js)
- `services/curriculum-service` — Course/lesson API (Node.js)
- `services/sandbox-service` — Docker-isolated code runner

### Why Go for the Compiler?
- Performance-critical: compiling/running user code needs low latency
- Native Docker SDK support
- Easy horizontal scaling for concurrent executions

### Why Prisma?
- Type-safe DB access from TypeScript
- Migration system for PostgreSQL
- Shared schema package used by all Node services

---

## Database Schema (PostgreSQL)

### Core Tables
- `users` — id, email, name, avatar, xp, streak, created_at
- `user_profiles` — bio, country, preferred_language, theme, locale
- `courses` — id, slug, language, title_en, title_ru, description_en, description_ru, level, order
- `chapters` — id, course_id, slug, title_en, title_ru, order
- `lessons` — id, chapter_id, slug, type (theory|exercise|quiz), content_en, content_ru, order
- `exercises` — id, lesson_id, starter_code, expected_output, test_cases (JSON)
- `user_progress` — user_id, lesson_id, completed, attempts, best_score, completed_at
- `achievements` — id, slug, title_en, title_ru, icon, xp_reward
- `user_achievements` — user_id, achievement_id, earned_at

### Learning Path Logic
- User picks language → assigned to root course for that language
- Chapters unlock sequentially (prev chapter 80%+ complete)
- Specialization branches unlock after Level 3 completion

---

## Supported Languages
| Language | Status | Compiler |
|----------|--------|----------|
| Python 3 | ✅ Active | CPython in Docker |
| JavaScript | ✅ Active | Node.js in Docker |
| TypeScript | 🔄 Planned | ts-node in Docker |
| Go | 🔄 Planned | go build in Docker |
| Java | 🔄 Planned | OpenJDK in Docker |
| C++ | 🔄 Planned | g++ in Docker |
| SQL | 🔄 Planned | PostgreSQL sandbox |
| HTML/CSS | ✅ Active | Browser-side preview |

---

## i18n Strategy
- Library: `next-intl`
- Locales: `en` (default), `ru`
- Route pattern: `/[locale]/...`
- Translation files: `apps/web/messages/{en,ru}.json`
- Locale detection: Browser header → stored in cookie

---

## Theme System
- Tailwind CSS v3 with `darkMode: 'class'`
- Radix UI primitives for accessible components
- CSS variables for color tokens (HSL)
- Theme stored in localStorage + cookie (SSR-safe)

---

## Task Status

### Phase 1: Foundation ✅
- [x] Monorepo structure
- [x] claude.md created
- [x] Next.js 14 config
- [x] next-intl setup
- [x] Tailwind + Radix UI
- [x] PostgreSQL schema (Prisma)
- [x] Docker sandbox config

### Phase 2: Core Features ✅
- [x] Landing page
- [x] Auth pages (login/register)
- [x] Monaco Editor component
- [x] Course tree UI
- [x] Lesson player (theory / exercise / quiz)
- [x] Code execution API → Go compiler service
- [x] Progress tracking API (complete lesson, score)
- [x] XP + Achievements system (streak multipliers, automatic awards)
- [x] NextAuth (credentials + GitHub + Google OAuth)
- [x] Dashboard with real DB queries
- [x] TanStack Query hooks (useCourse, useLesson, useDashboard)
- [x] Dev environment setup guide (VS Code/Terminal, macOS/Windows/Linux)
- [x] Docker runner images (Python, Node.js, Go, C++)
- [x] Python course seed: 8 chapters (Intro→OOP→Exceptions→File I/O), 16 lessons, 8 exercises
- [x] JavaScript course seed: 7 chapters (Basics→ES6+→async→Array methods), 14 lessons, 7 exercises
- [x] SQL course seed: 3 chapters, theory + exercises
- [x] HTML/CSS course seed: 3 chapters, theory + quizzes (4 quiz lessons)
- [x] Go course seed: 4 chapters, 8 lessons, 4 exercises
- [x] Java course seed: 4 chapters, 8 lessons, 4 exercises
- [x] C++ course seed: 4 chapters, 8 lessons, 4 exercises
- [x] Dashboard page: real data via useDashboard() hook
- [x] Navbar: session-aware auth (profile/settings/logout dropdown), Leaderboard link
- [x] Profile page: full edit, achievements grid, activity feed
- [x] Leaderboard page: top-3 podium + ranked list + current user rank
- [x] Settings page: theme/language toggle, password change, danger zone
- [x] Password change API: /api/auth/password PATCH
- [x] Error and not-found pages (locale + root level)
- [x] Dashboard loading skeleton

### Phase 3: Content ✅
- [x] HTML/CSS course
- [x] Go course (Level 1)
- [x] Java course (Level 1)
- [x] C++ course (Level 2)
- [x] Python course: 8 chapters (Intro, Variables, Control Flow, Functions, Lists, OOP, Exceptions, File I/O)
- [x] JavaScript course: 7 chapters (Basics, Control Flow, Functions, Arrays/Objects, ES6+, async/await, Array Methods)
- [x] Specialization: Django (parent: python-basics) — 4 chapters
- [x] Specialization: React (parent: javascript-basics) — 4 chapters

### Phase 5: Auth & Email ✅
- [x] Forgot password flow: /forgot-password page + /api/auth/forgot-password (token + Gmail)
- [x] Password reset page: /reset-password?token=... + /api/auth/reset-password
- [x] Email verification on register: token created, email sent via Gmail SMTP
- [x] Verify email page: /verify-email (success / expired / pending states)
- [x] Gmail SMTP via nodemailer (codenexus.noreply@gmail.com) — free, no domain needed
- [x] DB schema: PasswordResetToken + EmailVerifyToken models + migration applied
- [x] TypeScript course: 4 chapters, 8 lessons, 4 exercises (variables, functions, interfaces, generics)

### Phase 4: Polish ✅
- [x] Onboarding flow — already redirects to first lesson after language selection
- [x] Mobile responsive audit: dashboard stats (cols-1 sm:cols-3), profile stats (cols-2 sm:cols-4), CourseSidebar drawer on mobile with FAB button, LessonPlayer px-4 on small screens
- [x] SEO: sitemap.ts (static + course routes), robots.ts, locale metadata with OpenGraph, landing page generateMetadata, viewport meta, web app manifest
- [x] OG image generation (next/og) — /api/og?title=&subtitle=&lang= route, wired into learn page metadata
- [x] Performance audit: prose-content CSS class for markdown rendering, lazy-loaded Monaco editor

### Bugfixes (pre-launch)
- [x] validate API: Go returns status:"passed"|"failed", added `passed: boolean` mapping
- [x] quiz API: was stripping isCorrect from options — quiz answers never worked; fixed
- [x] useLesson: missing estimatedMin in LessonFull interface
- [x] QuizItem interface: added isCorrect?: boolean to options
- [x] Docker: sandbox Dockerfile had wrong relative paths for build context
- [x] Docker: stripDockerLogHeader was broken for multi-line output; replaced with stdcopy.StdCopy
- [x] Docker: added Java + SQLite runner Dockerfiles (were missing)

---

## Sub-Agent Responsibilities
- **Auth-Agent**: JWT, OAuth, session management, user profiles
- **Curriculum-Agent**: Course CRUD, progress tracking, XP logic
- **Editor-Agent**: Monaco integration, code execution, test case validation

---

## Key Commands
```bash
# Development
pnpm dev              # Start all services
pnpm dev:web          # Frontend only
pnpm dev:compiler     # Go compiler service

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed initial courses
pnpm db:studio        # Open Prisma Studio

# Docker
docker-compose up -d  # Start sandbox + DB
docker-compose down   # Stop all

# Build
pnpm build            # Build all
pnpm type-check       # TypeScript check across monorepo
```

---

## Environment Variables
```
# apps/web/.env.local
DATABASE_URL=postgresql://codenexus:password@localhost:5432/codenexus
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=http://localhost:3000
COMPILER_SERVICE_URL=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000

# services/.env
DATABASE_URL=postgresql://codenexus:password@localhost:5432/codenexus
JWT_SECRET=<secret>
DOCKER_SOCKET=/var/run/docker.sock
```
