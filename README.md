# TukoPay (MVP)

This workspace contains an MVP for TukoPay — a micro-payment link generator on Stellar testnet.

Structure:
- `backend/` — Express API + SQLite for storing link metadata
- `frontend/` — Vite + React + Tailwind app for creating links, paying, and a simple dashboard

Run backend:

```bash
cd backend
npm install
npm start
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend setup:
- Copy `frontend/.env.example` to `frontend/.env`.
- Configure `VITE_API_BASE`, `VITE_HORIZON_URL`, and `VITE_USDC_ISSUER`.

Notes & TODOs:
- Mainnet support not implemented — see `backend/index.js` for TODO details. // TODO(issue): add mainnet config
- Wallet support currently expects Freighter browser extension. // TODO(issue): add WalletConnect/Lobstr support
- Error handling and retries for transactions are TODOs. // TODO(issue): improve transaction UX
- No email/notification when a payment is received yet. // TODO(issue): add webhook or email integration
- No fee/conversion display. // TODO(issue): add price feed integration
TukoPay is a lightweight payment tool built on Stellar that lets freelancers, creators, and small businesses get paid without the friction of banks, cards, or high fees. You generate a unique link, share it anywhere (Twitter bio, invoice, WhatsApp), and anyone can pay you instantly in USDC. Payments settle on Stellar in seconds at a fraction of a cent in fees, no middlemen, no chargebacks, no waiting days for a payout. It's an early-stage MVP with core payment flow working end-to-end on testnet, and a set of clearly marked open issues (mainnet support, mobile wallets, notifications, auth, and more) for contributors to pick up and build out.