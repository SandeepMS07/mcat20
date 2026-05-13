# MCA T20 Web Context

## Stack

- Next.js 15 (App Router)
- React 18
- Axios for HTTP requests
- Tailwind CSS

## Request Flow

1. API constants are declared in `src/constant/index.ts`.
2. `getAxiosInstance` in `src/app/api/axiosInstance.js` builds axios clients with shared defaults.
3. `src/app/api/serverApi.js` uses that instance in server-side functions (`"use server"`), and wraps calls with retry/backoff logic.

## `serverApi.js` Behavior

- Retries transient failures for:
  - HTTP: `429`, `500`, `502`, `503`, `504`
  - network error codes: `ECONNABORTED`, `ECONNRESET`, `ENOTFOUND`, `EAI_AGAIN`
- Retry policy:
  - max retries: `2`
  - timeout per request: `15000ms`
  - exponential backoff with jitter and cap
  - supports `Retry-After` header when present
- On terminal failure:
  - logs structured error metadata
  - returns `null` (callers must handle nullable responses)

## Match Centre Page Integration

File: `src/app/matchcentre/page.jsx`

- Marked `"use client"` because it manipulates `document` directly.
- Injects external CSS and JS:
  - `https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app.css`
  - `https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app_matchcentre.js`
- Uses a fixed script id (`matchcentre-widget-script`) to replace stale script tags during mounts.
- Renders `<app-matchcentre>` custom element and delays visibility until script `load` event.

## Configuration Notes

- `BACKEND_URL` is currently production in `src/constant/index.ts`.
- A development API URL exists in comments; if environments are needed, migrate this to env vars (`process.env`) instead of toggling source code.
- Secret-like integration keys are currently plain constants; consider moving sensitive values to runtime env config.

## Practical Guardrails For Changes

- Keep `"use server"` API wrappers free from browser globals.
- Preserve retry behavior for live-data endpoints; avoid removing backoff unless upstream guarantees improve.
- If changing widget script loading, ensure script de-duplication and cleanup still happen to avoid duplicate custom element registration issues.
- Treat responses from `serverApi` as nullable (`null` on terminal failure).
