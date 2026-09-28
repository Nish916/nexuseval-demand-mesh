# Script — ~50–55 seconds

**Hook:** Old hardware gets a RustChain bonus — but that bonus does **not** grow forever.

In RustChain's current round-robin reward code, a PowerPC G4 starts with a 2.5-times antiquity multiplier. The time-aging function separates the part above one-times as the vintage bonus.

Then the code applies a 15-percent-per-year linear decay to that bonus. The result can fall back toward one-times as chain age increases.

There is an important exception: multipliers already below one — used as anti-farm penalties for some modern categories — are returned as-is. They do not decay upward toward one.

So the mechanism is not “older forever means more forever.” It is a temporary vintage weighting with explicit decay rules.

**End card:** Source: RustChain `node/rip_200_round_robin_1cpu1vote.py`.