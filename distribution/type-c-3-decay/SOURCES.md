# Sources — Type C #3

Primary source (current public RustChain tree):
https://github.com/Scottcjn/Rustchain/blob/main/node/rip_200_round_robin_1cpu1vote.py

Verified source blob SHA during preparation: `62d1aa83d317a92f1e43f80a0327792baa78172e`.

Claim map:
1. **PowerPC G4 = 2.5x base multiplier** — `ANTIQUITY_MULTIPLIERS`, PowerPC Mac block (`"g4": 2.5`). Maintainer review on #16601 also identifies this at line ~371 on the then-current file.
2. **15% linear decay parameter** — `DECAY_RATE_PER_YEAR = 0.15`.
3. **Only the bonus above 1.0 is decayed** — `get_time_aged_multiplier`: `vintage_bonus = base_multiplier - 1.0`, followed by the `aged_bonus` formula.
4. **Sub-1.0 penalties are returned unchanged** — same function: `if base_multiplier < 1.0: return base_multiplier`.
5. **This is a weighting rule, not benchmark speed or guaranteed earnings** — interpretation deliberately constrained to what the reward code actually computes.

Capture policy: show the actual repository source; do not fabricate command output.