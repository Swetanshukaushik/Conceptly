# Conceptly

Mobile-first educational reels app (MVP starter scaffold).

## Run locally in VS Code

### 1. Open workspace in VS Code

Open the project root folder in VS Code:

```bash
/Users/agentperry/Downloads/Swetanshu/Conceptly
```

Use the integrated terminal for all commands.

### 2. Install dependencies

Install workspace dependencies from the repo root:

```bash
npm install
```

If you prefer pnpm and have it installed, you can also run:

```bash
pnpm install
```

### 3. Start the backend

Open a terminal in VS Code and run:

```bash
npm run dev:backend
```

This uses the backend app in `apps/backend` and starts NestJS in watch mode on port `3000`.

If you need the database seeded first, run in another terminal:

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate:dev --name init
npm run prisma:seed
```

### 4. Start the mobile app

Open another terminal in VS Code and run:

```bash
npm run dev:mobile
```

This starts the Expo app in `apps/mobile`.

### 5. Run on a platform

Once Expo starts, you can use the terminal options or QR codes to launch on:

- `w` — web
- `i` — iOS simulator
- `a` — Android emulator

You can also run directly with:

```bash
npm run web
npm run ios
npm run android
```

### 6. Backend connectivity

The mobile app can use mock data or connect to the local backend.

- `EXPO_PUBLIC_USE_MOCK_DATA=true` uses mock data only
- `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/v1` points the app at the backend

If you want the mobile app to call the local API, start the backend first and ensure `apiBaseUrl` is configured accordingly in Expo extra or env.

## Helpful VS Code setup

- Use two terminals: one for the backend and one for the mobile app
- Run `npm run dev:backend` in one terminal
- Run `npm run dev:mobile` in the other terminal
- Use the Problems panel for compile issues
- Use the integrated terminal for `npm run typecheck` and `npm run router:types`

## Scripts

### Root workspace scripts
- `npm run dev:mobile` — start the mobile app via `apps/mobile`
- `npm run dev:backend` — start the backend via `apps/backend`
- `npm run build` — placeholder: use app-specific builds
- `npm run lint` — placeholder
- `npm run typecheck` — placeholder

### Backend scripts
Run from `apps/backend`:
- `npm run start:dev` — NestJS development server
- `npm run build` — build backend
- `npm run typecheck` — TypeScript check
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate:dev` — run migrations
- `npm run prisma:seed` — seed local database

### Mobile scripts
Run from `apps/mobile`:
- `npm start` — start Expo
- `npm run web` — start Expo web
- `npm run ios` — start Expo iOS
- `npm run android` — start Expo Android
- `npm run lint` — run Expo lint
- `npm run typecheck` — TypeScript check
- `npm run router:types` — Expo Router types setup
