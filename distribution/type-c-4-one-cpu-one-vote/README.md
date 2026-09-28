# RustChain Type C Shorts Kit #4 — 1 CPU = 1 Vote

Bounty: Scottcjn/rustchain-bounties#16601  
Contributor: @Nish916  
RTC wallet: `RTCbc589ef246bc1c5c8c44117f1d66b226f33b9f73`

**Working title:** What “1 CPU = 1 Vote” Actually Means in RustChain

A <=60s vertical package explaining the deterministic producer rotation in the current RIP-200 implementation: currently attested miners are collected, sorted, and block producer selection is `slot % len(attested_miners)`.

The short separates **producer selection** from **reward weighting** and does not claim that all miners earn identical rewards.

Includes script, exact-capture storyboard, metadata, and source map.