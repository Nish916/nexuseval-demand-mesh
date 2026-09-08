# RTC/x402 Payment Safety Gate

Prototype for RustChain Micro-Grant #402 — **Builder tier (100 RTC)**.

## Purpose

Autonomous agents need a boundary between receiving an HTTP payment quote and invoking a wallet/signer. This project provides that boundary as a small, deterministic, fail-closed preflight layer.

It does **not** hold keys, sign transactions, send RTC, or auto-spend. Its job is to answer two narrower questions safely:

1. **Before payment:** is this quote exactly what the owner's policy allows?
2. **After payment:** does the settlement receipt exactly match the quote we approved?

A third guard decides whether an ambiguous failed request can be retried without risking a duplicate payment.

## Threats covered

- amount changes between discovery and payment
- recipient/address drift
- wrong network or asset
- quote bound to a different task/request
- expired or excessively long-lived quotes
- receipt amount/recipient/request mismatch
- treating `pending` or missing transaction evidence as settled
- retrying after an already-settled payment
- retrying when payment state is ambiguous
- retrying after the seller changes quote semantics

## Core contract

`rtc_payment_gate.py` exposes:

- `validate_quote(...)` → `ALLOW_TO_SIGN` or fail closed
- `validate_receipt(...)` → `SETTLED` or fail closed
- `retry_decision(...)` → `RETRY_ALLOWED` or `STOP`

The returned `quote_fingerprint` is a SHA-256 hash over canonical quote semantics. A retry only proceeds when that fingerprint is unchanged.

## Why this extends RustChain

RustChain already exposes wallet, signed-transfer, agent, Beacon and x402-related surfaces. As autonomous buyers become more common, the dangerous boundary is not only signature verification on the server: it is also **buyer-side authorization before the signer is called and retry safety after an uncertain response**.

This prototype is intentionally wallet-agnostic so it can be embedded in:

- `rustchain-mcp` before a wallet transfer tool
- agent frameworks as a pre-action hook
- x402 clients before automatic 402 payment
- NexusEval or other sellers as a buyer-policy reference implementation

## Run tests

```bash
cd grants/rtc-payment-safety-gate
python -m unittest -v test_rtc_payment_gate.py
```

The suite covers valid preflight plus recipient drift, amount increase, request mismatch, expiry, TTL, settlement mismatch, pending receipt, duplicate-settlement retry, ambiguous retry, quote mutation and safe unchanged retry.

## Example policy

```json
{
  "max_amount": "1.00",
  "allowed_networks": ["rustchain-mainnet"],
  "allowed_assets": ["RTC"],
  "allowed_recipients": ["RTCbc589ef246bc1c5c8c44117f1d66b226f33b9f73"],
  "require_request_hash": true,
  "max_quote_ttl_seconds": 900
}
```

## Planned grant deliverable

If approved, the grant version will add:

1. adapters for RustChain/x402 quote and receipt shapes used by current public tooling;
2. persistent idempotency/receipt ledger with atomic writes;
3. `rustchain-mcp` pre-action integration example;
4. JSON Schema for policy, quote and receipt contracts;
5. fuzz/property tests for amount and serialization edge cases;
6. CLI demo and machine-readable audit log;
7. documentation for agent frameworks and a deterministic end-to-end demo.

## Safety scope

- No private keys or seed phrases.
- No wallet mutation in the gate itself.
- No real payment needed to run tests.
- Defaults to STOP on malformed or ambiguous state.
- A marketplace listing, quote, 402 response or pending receipt is never treated as settled revenue.

## Claimant

Nishant Sinha / `@Nish916`  
RTC wallet: `RTCbc589ef246bc1c5c8c44117f1d66b226f33b9f73`
