# Smart Farmer Hub — Client

This directory contains the React frontend built with Vite. It provides the UI used by buyers, farmers, and admins.

## Tech & Tooling

- React 18 + Vite
- CSS with plain files (see `src/App.css`)
- ESLint configuration in `eslint.config.js`

## Local development

1. Install dependencies:

```bash
cd client
npm install
```

2. Start the dev server:

```bash
npm run dev
```

By default Vite serves the app at `http://localhost:5173`.

## Environment

The frontend expects the backend API base URL to be provided via environment variables at build time. Create a `.env` or set `VITE_API_URL` before starting the dev server, for example:

```bash
VITE_API_URL=http://localhost:5000
```

## Production build

```bash
npm run build
npm run preview
```

## Project structure (important files)

- `src/` — React app source
- `src/component/` — UI components and pages
- `src/context/Authcontext.jsx` — auth provider
- `i18next/` — translations

If you want me to add a frontend-specific contributing guide, tests or CI config, I can scaffold that next.
