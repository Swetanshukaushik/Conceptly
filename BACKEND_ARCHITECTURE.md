# Backend Architecture Plan

## Document purpose

This document is the execution-grade backend architecture reference for the Conceptly AI-powered educational reels app. It is intended to live inside the repository and reflect the current implementation, domain boundaries, and maintenance assumptions.

This backend is implemented as a modular monolith inside `apps/backend`, but it is designed to remain extractable later with clear API contracts, independent config, and strong module ownership.

---

## Product context

Conceptly is a mobile-first educational app that delivers NCERT-aligned learning through short-form reels, topic navigation, and quick quizzes.

For MVP, the backend is responsible for:
- exposing curriculum hierarchy data
- assembling a home feed
- delivering topic/reel/quiz content
- persisting learning progress
- managing saved bookmarks
- ingesting analytics events
- supporting developer-friendly local runtime

The backend is not the product UI; it is the trusted data and learning state engine behind the app.

---

## Current repo placement

The backend lives in:

```txt
apps/backend
```

It must behave as an independently owned application even inside the monorepo.

### Independent application rules
- keep backend-facing implementation inside `apps/backend`
- do not import mobile-specific modules from backend
- keep backend `package.json`, `tsconfig.json`, env files, and runtime scripts self-contained
- expose all data through HTTP API contracts only
- keep shared type dependency minimal and optional

---

## Current backend stack

### Primary stack
- NestJS (modular monolith)
- TypeScript
- Prisma ORM
- SQLite for local development (`prisma/schema.prisma` currently uses `sqlite`)
- Swagger/OpenAPI docs at `/v1/docs`
- Zod-based environment validation
- HTTP REST API with explicit DTO contracts
- CORS enabled for Expo web and mobile clients

### Production-readiness note

The repo currently uses SQLite for local dev and seedable local data. The architecture remains compatible with production-grade engines such as PostgreSQL by swapping the Prisma datasource.

### Optional readiness
- Redis/queue scaffolding may be added later
- AI/content generation hooks may live under `reels` or `feed`
- analytics ingestion is currently a lightweight event sink

---

## Runtime and bootstrap

### `apps/backend/src/main.ts`

- enables CORS
- sets global prefix `v1`
- configures global validation pipes
- configures a global exception filter and request-id interceptor
- builds Swagger docs via `SwaggerModule.setup('docs', app, document)`
- starts on `PORT` or `3000`

### Environment validation

- configured in `apps/backend/src/config/env.schema.ts`
- current local runtime accepts optional `DATABASE_URL`
- runtime config currently defaults to SQLite local dev

### Local database

- `apps/backend/prisma/schema.prisma` currently uses:
  - `provider = "sqlite"`
  - `url = "file:./dev.db"`
- `apps/backend/prisma/seed.ts` seeds learners, subjects, chapters, topics, and learning state

---

## Current backend structure

```txt
apps/backend/
  src/
    main.ts
    app.module.ts
    config/
    common/
    database/
    modules/
      health/
      auth/
      users/
      curriculum/
      feed/
      reels/
      quizzes/
      progress/
      bookmarks/
      analytics/
  prisma/
    schema.prisma
    seed.ts
  package.json
  tsconfig.json
  .env
  .env.example
```

### Module ownership
- `health` — runtime health check and local DB connectivity
- `auth` — placeholder auth module for future identity support
- `users` — placeholder user profile context
- `curriculum` — class/subject/chapter/topic graph
- `feed` — home feed assembly and personalization hooks
- `reels` — topic reel retrieval and media metadata
- `quizzes` — topic quiz delivery
- `progress` — topic progress persistence
- `bookmarks` — saved topic/reel persistence
- `analytics` — lightweight event ingestion

---

## Current API surface

The backend exposes the following active routes under `/v1`.

### Health
- `GET /v1/health`
  - returns runtime status, DB connectivity, uptime

### Curriculum
- `GET /v1/curriculum/classes`
- `GET /v1/curriculum/classes/:classLevel/subjects`
- `GET /v1/curriculum/subjects/:subjectId/chapters`
- `GET /v1/curriculum/chapters/:chapterId/topics`
- `GET /v1/curriculum/topics/:topicId`

### Reels
- `GET /v1/topics/:topicId/reels`

### Quizzes
- `GET /v1/topics/:topicId/quiz`

### Feed
- `GET /v1/feed/home?classLevel=<number>`

### Progress
- `GET /v1/progress`
- `POST /v1/progress`

### Bookmarks
- `GET /v1/bookmarks`
- `POST /v1/bookmarks`
- `DELETE /v1/bookmarks/:bookmarkId`

### Analytics
- `POST /v1/analytics/events`

### Notes
- `auth` and `users` modules are present but intentionally lightweight in the current MVP
- the backend currently assumes a single development learner context and does not expose production auth flows yet

---

## Current data model

The current Prisma schema defines the following entities.

### User
- `id`, `email`, `displayName`
- optional `classLevel`
- `language`
- relations to `TopicProgress` and `Bookmark`

### Subject
- `id`, `name`, `classLevel`
- relation to `Chapter`

### Chapter
- `id`, `subjectId`, `title`, `order`
- relation to `Topic`

### Topic
- `id`, `chapterId`, `title`, `difficulty`
- relation to `Reel`, `TopicProgress`, `Bookmark`

### Reel
- `id`, `topicId`, `title`, `videoUrl`, `durationSec`
- relation to `QuizQuestion`

### QuizQuestion
- `id`, `reelId`, `prompt`, `optionsJson`, `answerKey`

### TopicProgress
- `id`, `userId`, `topicId`, `completionPercent`
- unique per `userId` + `topicId`

### Bookmark
- `id`, `userId`, `topicId`, optional `reelId`
- unique per `userId`, `topicId`, `reelId`

### AnalyticsEvent
- `id`, optional `userId`, `eventName`, `payload`

---

## Architecture principles

### Modular monolith
- keep features isolated in modules
- keep controllers thin and services responsible for business rules
- avoid mixing persistence concerns into controller logic

### API discipline
- every API route should have an explicit DTO contract
- keep transport DTOs separate from raw Prisma models
- validate inputs at the edge with NestJS pipes and DTOs

### Type safety
- Prisma provides typed DB access
- Nest controllers and services use explicit DTOs

### Shared types strategy
- backend owns its own DTOs and domain types
- shared types should be minimal and optional
- do not export Prisma models or Nest-specific DTOs into shared packages

### Deployment readiness
- local dev uses SQLite
- production should swap to a proper SQL engine such as PostgreSQL
- use Prisma migration workflows to keep schema portable

---

## Current implementation status

### Complete
- curriculum API
- feed API
- reels API
- quizzes API
- progress API
- bookmarks API
- analytics ingestion
- health check
- Prisma schema + local SQLite dev database
- Swagger docs and global API prefix

### Lightweight or placeholder
- auth module
- users module
- rich user profile APIs
- production authentication

---

## Development commands

From `apps/backend`:

```bash
npm install
npm run typecheck
npm run build
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
node --require ts-node/register src/main.ts
```

---

## Future extension guidance

### Extraction readiness
- keep the backend self-contained under `apps/backend`
- minimize cross-app dependencies
- keep API contracts stable
- keep the Prisma schema in the backend app

### Future additions
- proper auth and session support
- production database
- feed personalization and recommendations
- AI-generated reel/quiz content pipelines
- analytics aggregation and reporting
- media asset pipeline and background workers

---

## Repo-specific notes

- `apps/backend/src/main.ts` sets global API prefix `/v1`
- Swagger docs are available at `/v1/docs`
- CORS is enabled for Expo clients
- the repo currently uses SQLite local dev with `apps/backend/prisma/dev.db`
