# Metadata

## Primary title
**Zero RTC or Network Error? The Difference an AI Agent Must Know**

## Alternate titles
1. **Why Your AI Agent Must Never Turn API Failure Into 0**
2. **RustChain MCP: Honest Errors Beat Fake Balances**

## Description
A source-backed developer explainer about a small but important automation rule: a genuine zero balance is not the same state as a failed balance lookup.

The current rustchain-mcp documentation gives agent clients a machine-readable error contract for failures such as invalid identifiers, timeouts, non-JSON responses, rate limits and node unavailability. That lets an automation retry, warn or stop instead of silently inventing a 0 RTC balance.

Canonical project:
https://github.com/Scottcjn/rustchain-mcp

Sources are pinned in this package’s SOURCES.md.

Prepared by @Nish916 with AI assistance and factual verification against public source.

## Tags
RustChain, MCP, AI agents, API reliability, error handling, automation, agent engineering

## Chapters
00:00 Zero vs error
00:25 Two different states
01:05 The MCP error contract
01:50 Retryability
02:35 The danger of false zero
03:15 A three-way client policy
03:55 Honest uncertainty

## CTA
Build agents that preserve uncertainty instead of fabricating state.
