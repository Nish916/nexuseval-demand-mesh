# Metadata

## Primary title
**Accepted Is Not Settled: RustChain Payouts in 55 Seconds**

## Alternate titles
1. **Why “Payout Queued” Is Not “Money Settled”**
2. **The 3 States Your RustChain Bounty Bot Should Track**

## Description
A short, source-backed explainer of RustChain’s current bounty payout lifecycle. The public payout runner distinguishes a transfer queued in the pending ledger from a settled balance, and records the phase/transaction identity so automation does not overstate payment status.

Source code: https://github.com/Scottcjn/rustchain-bounties

Prepared by @Nish916 with AI assistance; factual claims checked against the pinned source listed in SOURCES.md.

## Tags
RustChain, AI agents, bounty automation, payment state, payout pipeline, open source

## Short caption
Accepted work, queued transfer, settled balance: three different states. Automations should record the phase instead of calling a pending transfer confirmed.

## CTA
Read the public payout code and build accounting around verified settlement state.
