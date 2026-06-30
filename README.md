# Task Management Application – Backend

A Node.js + Express REST API for the Task Management Application. This backend handles user authentication, task CRUD operations, and persistence via a PostgreSQL database (Neon). [file:241]

## Tech Stack

- Node.js (CommonJS)
- Express 5 [file:241]
- TypeScript
- PostgreSQL (Neon)
- jsonwebtoken for auth
- bcrypt for password hashing
- cors, dotenv, pg [file:241]

## Prerequisites

- Node.js 18+ installed locally
- A PostgreSQL database (e.g., Neon) with a connection string
- npm (comes with Node)

## Environment Variables

Create a `.env` file in the backend root with:

```env
PORT=4000
JWT_SECRET=your-secret-key
NEON_DB_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require&channel_binding=require
```

These variables are loaded via `dotenv` in `src/config/env.ts`. [file:241]

## Installation

```bash
# clone the repo
git clone <backend-repo-url>
cd backend

# install dependencies
npm install
```

Dependencies and devDependencies are defined in `package.json`. [file:241]

## Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js"
}
```

- `npm run dev` — start the backend in watch mode with auto‑restart (development).
- `npm run build` — compile TypeScript from `src` to `dist` using `tsc`. [file:241]
- `npm run start` — run the compiled server from `dist/app.js`.

## Project Structure

```text
backend/
  src/
    config/      # env + db (pg Pool)
    controllers/ # auth, tasks, users controllers
    middlewares/ # auth, error handling, etc.
    routes/      # /api routes aggregation
    services/    # business logic for auth, tasks
    models/      # DB access helpers
    app.ts       # Express app setup
    index.ts     # entry that exports the app for deployment
  dist/          # compiled JS output (after build)
  package.json
  tsconfig.json
  .env
```

TypeScript is configured with `rootDir: "src"` and `outDir: "dist"`; path aliases (`@config/*`, `@services/*`, etc.) are defined in `tsconfig.json`. [file:241]

## Running Locally

1. Ensure `.env` is configured correctly.
2. Start the dev server:

```bash
npm run dev
```

This runs `src/app.ts` with `ts-node-dev`, listening on `PORT` (default 4000). [file:241]

3. Test endpoints, for example:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

(Exact routes depend on the controllers and routes defined in `src/routes`.)

## Production Build & Run

```bash
npm run build
npm run start
```

This compiles TypeScript and runs `node dist/app.js`, which sets up the Express server, attaches routes under `/api`, and starts listening on the configured port. [file:241]

## Deployment Notes

- On platforms like Vercel, the Express app is typically exported (from `src/index.ts`) and used as a serverless function or Node server entry. [file:241]
- Ensure environment variables (`PORT`, `JWT_SECRET`, `NEON_DB_URL`) are set in the hosting provider’s dashboard.
- Database SSL options for Neon are configured in `config/db.ts` when creating the `pg` Pool. [file:241]

---
