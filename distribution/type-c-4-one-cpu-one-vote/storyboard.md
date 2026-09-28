# Storyboard / exact capture instructions

Format: vertical 9:16, <=60s.

| Time | Visual | Exact capture instruction |
|---|---|---|
| 0–5s | Hook | Original graphic: “1 CPU = 1 Vote ≠ hashrate race”. |
| 5–14s | Attested set | Capture `get_attested_miners` from the public RustChain source, including the recent-attestation filter and `ORDER BY miner ASC`. |
| 14–28s | Producer rule | Capture `get_round_robin_producer`; highlight the real comment “Each attested CPU gets exactly 1 turn per rotation cycle” and `producer_index = slot % len(attested_miners)`. |
| 28–39s | No lottery | Keep the actual source visible and overlay “No lottery / no probabilistic selection” using the wording from the function docstring. |
| 39–49s | Eligibility | Capture `check_eligibility_round_robin`, showing `not_attested`, `your_turn`, and `not_your_turn` states. |
| 49–56s | Distinction | Split card: “Producer rotation” vs “Reward weighting”. Avoid saying rewards are equal. |

No synthetic terminal output is required or permitted by this storyboard.