# SOL Flywheel

A fully automated Solana token rewards distribution system. LP fees flow through a flywheel mechanism to distribute SOL rewards to token holders via epoch-based Merkle claims.

## 🎯 Overview

The SOL Flywheel automatically:
1. **Claims LP fees** from your liquidity position
2. **Swaps to SOL** with slippage protection
3. **Routes funds** according to configurable weights:
   - 25% → Holder rewards (SOL)
   - 25% → Buyback (token reflections)
   - 25% → Buy & burn (deflationary)
   - 25% → Auto-LP (liquidity growth)
4. **Publishes epochs** with Merkle roots for verifiable claims
5. **Enables users** to claim rewards when they want

## 📁 Project Structure

```
sol-flywheel/
├── programs/              # Anchor smart contracts
│   ├── distributor/       # Merkle-based rewards distributor
│   └── controller/        # Treasury & config management
├── backend/               # API, indexer, epoch builder
│   ├── src/
│   │   ├── routes/        # REST API endpoints
│   │   └── services/      # Indexer, epoch builder
│   └── prisma/            # Database schema
├── keeper/                # Automation bot
│   └── src/services/      # Fee claim, swap, routing
├── frontend/              # Next.js web app
│   └── src/
│       ├── app/           # Pages (landing, earnings, epoch)
│       ├── components/    # UI components
│       └── hooks/         # React Query hooks
└── infra/                 # Docker, monitoring
    ├── prometheus/        # Metrics & alerts
    ├── grafana/           # Dashboards
    └── alertmanager/      # Alert routing
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Rust & Anchor CLI
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone and install dependencies
git clone <repo>
cd sol-flywheel
npm install

# Setup environment
cp backend/.env.example backend/.env
cp keeper/.env.example keeper/.env
cp frontend/.env.example frontend/.env.local

# Start infrastructure
cd infra && docker-compose up -d postgres redis

# Run database migrations
cd ../backend && npm run db:push

# Build Anchor programs
cd ../programs && anchor build
```

### Development

```bash
# Terminal 1: Backend API
cd backend && npm run dev

# Terminal 2: Keeper bot (optional)
cd keeper && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

## 🏗️ Architecture

### On-Chain Programs

#### Distributor Program
- **Initialize**: Setup admin and keeper authorities
- **Publish Epoch**: Submit Merkle root for new rewards epoch
- **Claim**: Verify proof and transfer SOL to claimant
- **Fund Vault**: Accept SOL deposits for rewards

#### Controller Program
- **Config Management**: Weights, slippage limits, max trade sizes
- **Keeper Authorization**: Whitelist keeper addresses
- **DEX Allowlist**: Approved swap routes
- **Pause/Unpause**: Emergency stop mechanism

### Backend Services

#### API Endpoints
- `GET /api/v1/metrics` - Live flywheel metrics
- `GET /api/v1/epochs` - List all epochs
- `GET /api/v1/wallet/:address/earnings` - Wallet earnings breakdown
- `GET /api/v1/proof/:epoch/:address` - Merkle proof for claiming
- `POST /api/v1/admin/*` - Protected admin operations

#### Indexer
- Subscribes to token transfers and program events
- Maintains wallet balance snapshots
- Tracks claims and transactions

#### Epoch Builder
- Snapshots holder balances at epoch boundary
- Calculates proportional allocations
- Builds Merkle tree and stores proofs
- Generates audit artifacts (CSV, checksums)

### Keeper Bot

Scheduled automation:
- **Every 15 min**: Check and claim LP fees
- **Hourly**: Full cycle (claim → swap → route → publish)
- **Every 5 min**: Health checks

Safety features:
- Circuit breaker (auto-pause on failures)
- Slippage protection
- Daily trade limits
- Allowlisted DEX routes

### Frontend

Pages:
- **Landing**: Flywheel explanation + live metrics
- **Earnings**: Wallet lookup + claim flow
- **Epoch**: Transparency page with Merkle root + CSV hash

## 🔐 Security

### Non-Negotiables

1. **Multisig Admin**: Controller and Distributor admin should be a multisig
2. **Limited Keeper Keys**: Keepers can only call specific instructions
3. **On-Chain Enforcement**:
   - Max trade size per transaction
   - Max slippage in basis points
   - Allowlisted DEX programs
   - Pause switch
4. **Circuit Breaker**: Auto-pause on repeated failures
5. **Full Reconciliation**: Verify sum(allocations) == funded_pool
6. **Transparency Artifacts**: Publish epoch CSV hash + Merkle root

### Audit Checklist

- [ ] Merkle proof verification is correct
- [ ] Double-claim prevention works
- [ ] Slippage limits enforced on-chain
- [ ] Keeper authorization checked
- [ ] Admin operations require correct signer
- [ ] Overflow checks on all math

## 📊 Monitoring

### Prometheus Metrics

- `treasury_balance_lamports` - Current treasury balance
- `keeper_cycle_success_total` - Successful keeper cycles
- `keeper_cycle_failures_total` - Failed keeper cycles
- `swap_slippage_bps` - Actual slippage on swaps
- `keeper_circuit_breaker_state` - 0=closed, 1=open, 2=half-open

### Alerts

- **Critical**: Keeper down, circuit breaker open
- **Warning**: High slippage, low treasury, RPC errors
- **Info**: Low claim rate, epoch delays

### Grafana Dashboard

Access at `http://localhost:3001` (default: admin/admin)

## 🧪 Testing

```bash
# Anchor program tests
cd programs && anchor test

# Backend tests
cd backend && npm test

# Keeper tests
cd keeper && npm test
```

## 📦 Deployment

### Programs (Devnet)

```bash
cd programs
anchor build
anchor deploy --provider.cluster devnet
```

### Infrastructure

```bash
cd infra
docker-compose up -d
```

### Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

## ✅ Acceptance Checklist

- [ ] Keeper can run full cycle: claim → swap → route → fund → publish
- [ ] Users can see earnings breakdown by wallet
- [ ] Users can claim and program prevents double claims
- [ ] Every epoch is reproducible from stored inputs
- [ ] Admin can pause/unpause and rotate keeper keys
- [ ] Monitoring catches failures and auto-pauses

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

---

Built with ❤️ for the Solana ecosystem


