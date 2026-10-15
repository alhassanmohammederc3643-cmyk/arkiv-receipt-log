# Arkiv friction report (14 October 2026)

Versions: Node 22.23.3, npm 10.9.9, `@arkiv-network/sdk` 0.8.1, exact dependency versions in package-lock.json. Tiramisu chain ID 7738577.

## SDK / network: direct read works

Expected: a public client should query without a wallet or API key. Actual: `getChainId()` returned 7738577, `getBlockNumber()` returned a live block, and the compound creator-filtered query returned zero entities before seeding. The desktop and mobile UI also queried successfully without errors. Zero entities is an unseeded state, not evidence of writes.

Reproduce: `npm ci && npm run query`. Read `scripts/query.mjs`. Compare the chain ID and block number against RPC. Query uses project + entity type + numeric amount + protocol creator. No invented result cache.

## Attributes / payload: validation is caller-owned

Expected: typed attributes, strict JSON and deterministic receipt hashes can be kept consistent. Actual: SDK types expose typed attribute values; the app validates payload with Zod and checks service, amount, network, status, hash and read-only flag itself. `npm test` confirms invalid network/status, unknown personal fields and changed amount are rejected or alter the commitment.

Reproduce: `npm test`; inspect `src/receipt.mjs` and `src/arkiv.ts`. Suggested improvement: a short official end-to-end example pairing typed attribute verification with a strict payload schema would reduce the chance of builders trusting payload metadata alone.

## Docs: creator guidance is useful

Expected: a project attribute is sufficient for namespacing but not authentication. Actual: the official best-practices page specifically documents `.createdBy()` and immutable `$creator`. This directly shaped the security filter.

Source: https://docs.arkiv.network/typescript-sdk/best-practices/

## Faucet / Hub: external wallet connection required

Expected: obtain test GLM for a dedicated local publisher wallet. Actual: the public Hub faucet renders "Connect your wallet" and offers Rainbow, Base, MetaMask and WalletConnect. It does not offer an address-only claim in the observed UI. The browser could not claim; the owner later funded the dedicated publisher with 10 test GLM on Oct 15. This is a setup dependency, not a claimed outage or anti-bot issue.

Reproduce: open https://hub.arkiv.network/faucet/ signed out, select Connect wallet and inspect options. Suggested improvement: document the supported local-development funding path alongside the faucet, including whether a CLI/address-only option exists.

## Writes, flags and expiry: verified Oct 15

`scripts/seed.mjs` prepares a three-entity batch with 21-day expiration, read-only and permissionless-extension flags. The batch landed in transaction `0x790373f9bf4902579bd3f70ed840c57443d5208b753117750f3b09e5e5e00d75`. At block 589307, creator-filtered readback returned all three entities with `readonly: true`, `permissionlessExtension: true`, matching hashes and numeric amounts. Public evidence is in `public/evidence.json`. Expected: one atomic batch and three valid reads. Actual: exactly that. Reproduce: `npm run query`, then inspect creator, flags and payloads. The live app shows all three as Verified creator + hash. Do not claim tested patch, delete, renewal, ownership transfer or event streaming.
