# Sources / Claim Map

Primary source: https://github.com/Scottcjn/Rustchain/blob/main/README.md

| Script claim | Public source evidence |
|---|---|
| PowerPC G4 multiplier is 2.5x | RustChain README hardware multiplier table: `PowerPC G4 (2003) | 2.5x | ANCIENT`. |
| Modern x86_64 multiplier is 0.8x | Same table: `Modern x86_64 | 0.8x | MODERN`. |
| Project calls the mechanism Proof of Antiquity | README title/badges and “Proof-of-Antiquity rewards hardware for surviving, not for being fast” section. |
| Hardware fingerprinting uses six checks | README “Hardware Fingerprinting (6 Checks No VM Can Fake)” block lists clock-skew/oscillator drift, cache timing, SIMD identity, thermal drift entropy, instruction path jitter, and anti-emulation detection. |
| Project frames old-hardware preservation as a goal | README “Why This Exists” states that working machines are discarded and that Proof-of-Antiquity rewards hardware for surviving; it explicitly connects higher old-hardware multipliers with preservation/e-waste. |
| VM/emulator resistance is part of the stated design | README says a SheepShaver VM pretending to be a G4 will fail and describes server-side cross-validation, ROM clustering, timing-distribution analysis, and thermal-anomaly checks. |

## Claims intentionally excluded

The package does **not** assert:
- a guaranteed RTC payout per hour/day;
- a guaranteed fiat return;
- that a G4 is computationally faster than modern x86;
- that every anti-emulation claim has been independently reproduced by this package author;
- any benchmark not explicitly present in the cited public source.

Last source verification: 2026-09-06.
