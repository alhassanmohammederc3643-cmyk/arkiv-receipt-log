# Arkiv data contract v1

Network: Tiramisu **testnet**, chain ID 7738577. SDK: `@arkiv-network/sdk` 0.8.1.

## Entity type: receipt

Every entity is JSON with the strict schema defined in `src/receipt.mjs`. Payload keys: version (1), kind (`synthetic_x402_receipt`), network (`testnet`), requestId (synthetic `demo-*` ID), service (image-generation or compliance-check), amountMicrounits (positive integer <=1,000,000), currency (USDC), status (`simulated`), createdAt (ISO timestamp), responseDigest (hash of synthetic response) and the fixed disclosure note. Unknown keys are rejected.

| Attribute | Type | Purpose |
|---|---|---|
| project | str | `arkiv-x402-receipt-log-2026-v1` namespace |
| entity_type | str | `receipt` |
| service | str | Query a demo service |
| amount_microunits | i32 | Numeric range filter, not a float |
| network | str | `testnet` |
| status | str | `simulated`, never `settled` |
| receipt_hash | str | keccak256 of strictly validated, alphabetically keyed JSON |

Creator: protocol `$creator` must equal `0x02994F5588Cbb3FC21aC3dd54fa237246C509498`. No payload creator field is used. Ownership is shown but is not the trust anchor.

Lifetime: 21 days from creation. These are demo review records, not permanent audit records. Creation flags: `readonly: true` to prevent content mutation, `permissionlessExtension: true` to allow another reader to retain the data. The current app reads these flags and rejects records without read-only protection; it does not implement extension.

## Exact read query

```ts
client.select({ key: true, creator: true, owner: true, payload: true,
  attributes: true, expiresAt: true, creationFlags: true })
  .where(eq('project', 'arkiv-x402-receipt-log-2026-v1'),
    eq('entity_type', 'receipt'), gte('amount_microunits', 0))
  .createdBy('0x02994F5588Cbb3FC21aC3dd54fa237246C509498')
  .limit(12).fetch();
```

Optional `.where(eq('service','image-generation'))` narrows the service. The amount selector replaces zero with 50000. `page.next()` fetches the next cursor-bound page when `page.hasNextPage()` is true. The UI can disable creator filtering for inspection only; resulting cards remain untrusted unless the protocol creator matches.

Payload hash, indexed service/amount/network/status and read-only flag must agree. The renderer escapes untrusted strings and catches invalid JSON/schema. Records with a bad payload never count as verified.

## Write query

`scripts/seed.mjs` makes three synthetic receipts with distinct request IDs, batches them with `executeBatch({ creates })` and records its public evidence. It validates chain ID before creating anything. No production data or keys are included.

## Security boundary

Consistency is not settlement verification. A creator can publish false data. Only synthetic receipts are supported. Users must not infer that this index proves an actual payment or that test USDC amounts have cash value.
