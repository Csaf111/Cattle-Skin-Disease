# Cattle Skin Disease Detection

A full-stack disease-screening application that combines a React client, an Express/MongoDB application service, and a Flask TensorFlow Lite inference service. Authenticated users upload cattle skin images, receive model predictions, and track their historical analyses.

## Architecture

```text
React client -> Express API -> MongoDB
                   |
                   -> Flask inference service -> TensorFlow Lite model
```

The Express API owns authentication, upload records, and authorization. The inference service is called with a file path retrieved from an image record owned by the authenticated user; clients do not supply filesystem paths.

## Local setup

1. Copy `.env.example` to `.env` and replace every placeholder.
2. Install client dependencies with `npm ci`.
3. Install service dependencies with `cd server && npm ci`.
4. Start MongoDB, then run the Flask service (`python flask_server.py`) and Express service (`npm start`) from `server/`.
5. Start the client with `npm run dev` from the repository root.

Set a unique `SESSION_SECRET` of at least 32 characters. The server fails fast if it is missing, too short, or OAuth/database configuration is absent. Never commit `.env` files, and rotate any credential that was previously committed.

## Quality checks

```bash
npm run lint
npm run build
cd server && npm test
```

GitHub Actions runs these checks on pull requests and on changes to `main`.

