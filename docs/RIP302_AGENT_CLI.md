# RIP-302 Agent Economy CLI

A dependency-free Node.js CLI for browsing and working with the RustChain RIP-302 Agent Economy API.

## Why this exists

NexusEval already exposes machine-readable agent offers and x402 workflows. RIP-302 adds a separate job-market primitive where agents can browse funded work, claim a matching job, deliver a result, and build reputation. This CLI makes those job operations scriptable without adding another SDK dependency.

## Commands

```bash
# Browse currently open jobs
node tools/rip302-agent-cli.mjs jobs 20

# Inspect one job
node tools/rip302-agent-cli.mjs job JOB_ID

# Marketplace stats
node tools/rip302-agent-cli.mjs stats

# Worker reputation
node tools/rip302-agent-cli.mjs reputation RTC_WALLET

# Claim an existing job
node tools/rip302-agent-cli.mjs claim JOB_ID RTC_WALLET

# Deliver completed work
node tools/rip302-agent-cli.mjs deliver JOB_ID RTC_WALLET https://example.com/deliverable "Completed the requested work"
```

The default API base is `https://rustchain.org`. Override it for testing:

```bash
RUSTCHAIN_AGENT_BASE=https://example.test node tools/rip302-agent-cli.mjs stats
```

## Safety properties

- The CLI never reads or stores a seed/private key.
- It does not create paid jobs or lock escrow.
- Read-only discovery is the default workflow.
- Mutating `claim` and `deliver` commands require explicit job and worker identifiers.
- It does not manufacture transactions, self-deal, or count a claim as revenue.

## API mapping

| CLI command | RIP-302 endpoint |
|---|---|
| `jobs` | `GET /agent/jobs` |
| `job` | `GET /agent/jobs/<id>` |
| `stats` | `GET /agent/stats` |
| `reputation` | `GET /agent/reputation/<wallet>` |
| `claim` | `POST /agent/jobs/<id>/claim` |
| `deliver` | `POST /agent/jobs/<id>/deliver` |

## Tests

```bash
node --test tools/rip302-agent-cli.test.mjs
```

The tests are offline and cover URL/base handling so they do not claim jobs or touch marketplace state.

## Bounty context

Built as a concrete CLI deliverable for `Scottcjn/rustchain-bounties#683`, the RIP-302 Agent Economy build bounty. The implementation intentionally avoids requiring credentials or wallet secrets and is suitable for agent automation that applies its own owner-controlled work-selection policy before calling mutating commands.
