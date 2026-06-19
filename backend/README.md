# TukoPay backend

Lightweight Express + SQLite backend for TukoPay MVP.

Run:

```bash
cd backend
npm install
npm start
```

Endpoints:
- `POST /api/links` — create link { name, publicKey, amount?, message?, slug? }
- `GET /api/links/:slug` — fetch link metadata
- `GET /api/dashboard/:publicKey` — returns recent payments from Horizon
