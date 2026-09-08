# Strands × RustChain RIP-302 Agent Economy

Bounty target: `Scottcjn/rustchain-bounties#685` — **Tier 2 Agent Integration (75 RTC)**.

Claimant: Nishant Sinha / `@Nish916`  
RTC wallet: `RTCbc589ef246bc1c5c8c44117f1d66b226f33b9f73`

## What this builds

A Strands Agents SDK integration for RustChain's RIP-302 Agent Economy. It lets a Strands agent discover marketplace work, inspect a specific job, check an agent's reputation, and read aggregate marketplace stats using the current public RIP-302 API.

The useful agent loop is:

`user goal → browse open RIP-302 jobs → filter by category/reward → inspect exact job → check counterpart reputation → report exact job ID/status`

## Why the integration is deliberately safe-by-default

The reviewed current `rip302_agent_economy.py` still identifies actors on state-changing lifecycle routes using JSON wallet strings such as `poster_wallet` and `worker_wallet`. The repository itself contains `audits/rip302_escrow_auth_bypass_71.md`, documenting that this legacy design does not cryptographically prove control of those wallet identifiers.

So this integration does **not** silently turn those mutation endpoints into autonomous Strands tools.

- Public GET/discovery operations are available normally.
- Mutation client methods exist only as interoperability references.
- `post_job`, `claim_job`, and `deliver_job` raise `UnsafeMutationError` by default.
- An explicit `allow_legacy_unsigned_mutations=True` opt-in is required for a trusted/local deployment or after authenticated upstream mutation semantics are available.

This makes the framework integration useful now without teaching an autonomous agent to impersonate public wallet IDs or move escrow through an upstream identity gap.

## Files

- `client.py` — dependency-light RIP-302 HTTP client, safe GETs + fail-closed legacy mutation wrappers.
- `agent.py` — Strands `Agent` plus four custom `@tool` functions.
- `test_client.py` — deterministic tests using mocked HTTP; no real RTC and no state-changing network calls.
- `SOURCES.md` — route/contract mapping to the current RustChain repository.

## Strands tools

### `browse_agent_jobs`
Queries `GET /agent/jobs` with status/category/minimum reward filters.

### `inspect_agent_job`
Queries `GET /agent/jobs/<job_id>` for the exact lifecycle state and job details.

### `inspect_agent_reputation`
Queries `GET /agent/reputation/<wallet_id>`.

### `inspect_agent_economy_stats`
Queries `GET /agent/stats`.

The system prompt explicitly prevents the agent from calling a listing "funded", "accepted", "delivered", or "paid" unless tool evidence proves that state.

## Install

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run the tests

```bash
python -m unittest -v test_client.py
```

No keys, wallets, funds, or live mutations are needed.

## Run a Strands demo

Configure a Strands-supported model provider as documented by Strands, then:

```bash
export RUSTCHAIN_NODE=https://rustchain.org
python agent.py
```

Optional prompt:

```bash
export RIP302_DEMO_PROMPT='Find open testing or code jobs paying at least 5 RTC and show the exact job IDs.'
python agent.py
```

## Current upstream API contract used

Read surfaces:

- `GET /agent/jobs`
- `GET /agent/jobs/<job_id>`
- `GET /agent/reputation/<wallet_id>`
- `GET /agent/stats`

Legacy mutation wrappers modeled but blocked by default:

- `POST /agent/jobs`
- `POST /agent/jobs/<job_id>/claim`
- `POST /agent/jobs/<job_id>/deliver`

## Bounty fit

Issue #685 explicitly pays Tier 2 for integrating RIP-302 Agent Economy with an existing agent framework. Strands is an established agent framework and, after a duplicate search of the RustChain codebase and the #685 discussion, I found no existing Strands Agent Economy integration.

This submission is an actual framework adapter with tests and a safety boundary, not a claim-only comment or generic execution plan.

## Possible upstream follow-up

Once RIP-302 exposes cryptographically authenticated mutation semantics, the same client can add signed `post/claim/deliver/accept` Strands tools without weakening the default security model. The separation between read tools and mutation methods is intentional so that upgrade is small and reviewable.
