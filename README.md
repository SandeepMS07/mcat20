# MCA T20 Web

Frontend for the MCA T20 experience, built with Next.js (App Router).

## Local Setup

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Scripts

- `npm run dev`: start local development server
- `npm run build`: production build
- `npm run start`: run production build

## Key Runtime Areas

- `src/app/api/axiosInstance.js`: centralized axios instance factory.
- `src/app/api/serverApi.js`: server-side API wrapper with retry/backoff for transient failures.
- `src/app/matchcentre/page.jsx`: client page that injects external Match Centre widget assets.
- `src/constant/index.ts`: environment/config constants (API base URL and integration keys).

## Engineering Context

Detailed architecture and flow notes:

- `docs/CONTEXT.md`
