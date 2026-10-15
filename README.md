# Receipt Log: synthetic x402 receipts on Arkiv Tiramisu testnet

A standalone, new hackathon build created on 14 October 2026. This project indexes **synthetic agent-service receipts**, not settled payments. No USDC is transferred. No revenue, users or mainnet readiness are claimed.

## What works

- Browser and CLI query Arkiv directly, with no project backend or conventional database.
- Compound project/type/service/amount filters and cursor pagination.
- Immutable protocol `$creator` filtering, strict payload schema and a canonical keccak256 commitment.
- Batch creation of read-only records with a 21-day lifetime and permissionless extension.
- A local integrity exercise: edit a simulated amount and see the commitment mismatch.

## Current readiness

Local build and unit/browser tests pass. RPC chain check and empty live query pass. Public MIT source and [judge-facing app](https://arkiv-receipt-log.vercel.app/) are live. Three synthetic receipts were seeded and read back on Tiramisu on Oct 15. The 2:02 captioned live demo is in `public/demo.mp4`; public transaction evidence is in `public/evidence.json`. Owner review and registration/submission are still pending.

## Reproduce

Node 22+.

```sh
npm ci
npm test
npm run build
npm run dev
npm run query
```

The read-only app needs no wallet. Queries run against Tiramisu, chain ID 7738577. In the UI click "Query Arkiv", filter by image generation or minimum 0.05 simulated USDC, and open the exact query. No cache masquerades as live results.

## Seed testnet data

Use a dedicated disposable wallet with **test GLM only**. Never use a real payout wallet. Obtain test GLM using the official [Arkiv faucet](https://hub.arkiv.network/faucet/). The faucet currently requires connecting a wallet. Create a local `.env` from `.env.example` and keep it outside source control. Never paste keys into an issue, submission or UI.

```sh
npm run seed
npm run query
```

`src/config.ts`, `scripts/query.mjs` and `scripts/seed.mjs` must use the same publisher address. The submission publisher for this build is `0x02994F5588Cbb3FC21aC3dd54fa237246C509498`. The seed script refuses any chain other than Tiramisu and saves only public transaction evidence, never the secret.

## Trust and limitations

- `$creator` proves authorship, not honest authorship. An approved publisher could lie.
- Schema validation and a hash match establish data consistency, not USDC payment settlement.
- Records are created read-only. We do not call patch/delete or claim perpetual storage.
- Permissionless extension is enabled; the UI does not yet offer a renewal operation. Initial 21-day retention covers judging through 23 October when seeded on 15 October.
- Expiry is displayed as a block number, not an invented wall-clock timestamp.
- Only synthetic IDs, service names and generated response hashes are stored. No email, phone number, customer data, prompts, real payments or private keys, even hashed.
- The creator address must be changed if another team seeds its own fork. The project attribute alone is not a trust anchor.

## Why Arkiv

The buyer of an agent service should not need the seller's receipt API to inspect its history. A Postgres operator can hide or edit its own rows; IPFS supplies content addressing but not this shared typed, creator-filtered index; a subgraph adds a separately operated index. Arkiv gives this demo independently readable, indexed, time-scoped entities whose on-chain creator is visible without our backend.

We intentionally keep payment settlement and generated images off Arkiv. This demo does not validate an external settlement chain.

## Baseline / attribution

No pre-Oct 9 project code was reused. The **idea** follows the builder's prior x402 / Pay-Per-Pixel work; it is not a port of their code. This implementation, Arkiv integration and core receipt logic were created on 14 October. Third-party dependencies are listed and locked in `package-lock.json`: Arkiv SDK 0.8.1, viem, Zod, Vite, TypeScript and Playwright. Their licenses remain their own. AI coding assistance was used.

## Entry files

- `arkiv/schema.md`: data contract, retention and exact query
- `arkiv/friction.md`: observed paths, versions and reproduction

License: MIT. See LICENSE. Dependencies retain their own licenses.
