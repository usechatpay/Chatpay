# ChatPay

> A conversational payment layer built on the Stellar blockchain.

## Overview

ChatPay aims to reduce this complexity by creating a conversational layer for payments. Instead of requiring users to navigate a traditional crypto payment interface, ChatPay guides them through the transaction using a familiar chat experience while Stellar handles the underlying settlement.

---

## Architecture

The project consists of two core workspaces:

- **[`chatpay-backend/`](./chatpay-backend/)**: Fastify & Node.js service, Prisma ORM (PostgreSQL), Stellar Horizon integration, ed25519 challenge-response wallet auth (supporting SEP-53), natural-language payment command parser (OpenAI `gpt-4o-mini` + regex rules), and real-time Socket.IO gateway.
- **[`chatpay-frontend/`](./chatpay-frontend/)**: Next.js 16 (Turbopack, App Router) and React 19 application with Tailwind CSS, Freighter browser extension wallet signing, and a secure server-side API proxy utilizing HttpOnly session cookies.

---

## Quick Start & Setup

### Prerequisites
- Node.js (v20+ recommended, v22 supported)
- PostgreSQL (or Docker)
- [Freighter Wallet Extension](https://www.freighter.app/) set to **Testnet**

### 1. Backend Setup

```bash
cd chatpay-backend
npm install

# Configure environment (copy .env.example with your credentials)
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server (http://localhost:4000)
npm run dev
```

### 2. Frontend Setup

```bash
cd chatpay-frontend
npm install

# Start frontend development server (http://localhost:3000)
npm run dev

# Or connect directly to the hosted Render backend:
CHATPAY_API_URL=https://chatpay-7anj.onrender.com npm run dev
```

---

## Testing & Quality Checks

- **Backend Test Suite**: `cd chatpay-backend && npm test` (31 unit, auth, security & parser tests)
- **Frontend Test Suite**: `cd chatpay-frontend && npm test` (24 wallet, flow & contract tests)
- **Frontend Lint & Build**: `cd chatpay-frontend && npm run lint && npm run build`
- **Live On-Chain E2E**: `cd chatpay-backend && npm run test:e2e`

---

## Live Deployment Endpoints

- **Frontend Application**: [https://chatpay-frontend.vercel.app/](https://chatpay-frontend.vercel.app/)
- **API Base URL**: [https://chatpay-7anj.onrender.com](https://chatpay-7anj.onrender.com)
- **Health Check**: [https://chatpay-7anj.onrender.com/health](https://chatpay-7anj.onrender.com/health)
- **Interactive Swagger Docs**: [https://chatpay-7anj.onrender.com/docs](https://chatpay-7anj.onrender.com/docs)

---

## Documentation & Key References

- [Frontend ↔ Backend Integration Contract (`HANDSHAKE.md`)](./chatpay-backend/HANDSHAKE.md)
- [Frontend Workspace Setup & Security (`workspace-setup.md`)](./chatpay-frontend/docs/workspace-setup.md)
- [Real-Time WebSocket Events Catalog (`realtime-events.md`)](./chatpay-backend/docs/realtime-events.md)
- [OpenAPI 3.1 Specification (`openapi.json`)](./chatpay-backend/openapi.json)
- [StellarExpert Testnet Explorer](https://stellar.expert/explorer/testnet)
- [Freighter Documentation & API](https://docs.freighter.app/)
