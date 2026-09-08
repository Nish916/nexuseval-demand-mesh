# Script — “Why old hardware gets the bigger multiplier”

**Target runtime:** ~48–55 seconds at a natural 135–150 wpm.

## Hook

What if a 2003 PowerBook got a bigger blockchain reward multiplier than a modern PC — on purpose?

## Narration

RustChain calls the idea **Proof of Antiquity**.

Instead of rewarding only the newest, fastest hardware, its published multiplier table gives a **PowerPC G4 from 2003 a 2.5× multiplier**, while **modern x86_64 is listed at 0.8×**.

But age alone is not enough. RustChain says it verifies physical machines with **six hardware checks**: clock-skew and oscillator drift, cache timing, SIMD identity, thermal drift, instruction-path jitter, and anti-emulation detection.

The point is to distinguish real silicon from virtual machines and emulator farms, then reward keeping working hardware alive.

So the unusual thesis is simple: on this network, being old can be an asset instead of a disadvantage.

If you want to inspect the implementation and the published multiplier table, start with the RustChain repository and its Proof-of-Antiquity docs.

## On-screen disclosure

`Multipliers and hardware-verification claims shown are RustChain's published protocol/project claims; this video does not promise profit or token value.`