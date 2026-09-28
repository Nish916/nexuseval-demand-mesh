# Source Map

Primary source:
https://github.com/Scottcjn/Rustchain/blob/main/specs/RIP_POA_SPEC_v1.0.md

## Claim mapping
1. **PoA is the enforcement layer for RIP-200’s 1-CPU-1-Vote round-robin consensus.** — Abstract and §1.1.
2. **Without attestation, one machine could create many VM identities.** — §1.1.
3. **Server re-evaluates raw fingerprint evidence rather than trusting `passed`.** — §3 preamble and §4.3.
4. **Passed miners are enrolled with weight equal to the time-aged antiquity multiplier.** — §2.1 steps 5–6.
5. **Attestation TTL is 86,400 seconds / 24 hours.** — §2.1 step 7.
6. **Epoch settlement is 1.5 RTC per epoch weighted by antiquity multiplier.** — §2 System Overview.
7. **PowerPC G4 base multiplier = 2.5×.** — §5.1 PowerPC Mac table.
8. **Generic modern Intel/AMD x86 base multiplier = 0.8×.** — §5.1 Modern table.
9. **Antiquity multipliers are time-decaying.** — Abstract and §2.1.
10. **Anti-emulation evidence is required and architecture can be overridden by evidence.** — §4.1–§4.3.
11. **MAC addresses are hashed with epoch-scoped salts.** — §1.3 Design Goal 5.

## Explicit non-claims
- 2.5× is not a CPU-speed benchmark.
- No token market price or cash conversion is claimed.
- No guaranteed earnings or investment return is claimed.
- Diagrams are illustrative unless labeled as source captures.
