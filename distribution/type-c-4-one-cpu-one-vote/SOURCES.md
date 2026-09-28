# Sources — Type C #4

Primary source:
https://github.com/Scottcjn/Rustchain/blob/main/node/rip_200_round_robin_1cpu1vote.py

Verified blob SHA: `62d1aa83d317a92f1e43f80a0327792baa78172e`.

Claim map:
1. **Only recently attested miners enter the set** — `get_attested_miners` filters `miner_attest_recent` by `current_ts - ATTESTATION_TTL`.
2. **Deterministic ordering** — the SQL in `get_attested_miners` uses `ORDER BY miner ASC`.
3. **Exactly one producer turn per rotation cycle** — `get_round_robin_producer` docstring/comment.
4. **Producer index = slot modulo miner count** — `producer_index = slot % len(attested_miners)`.
5. **No lottery / probabilistic selection** — explicitly stated in `get_round_robin_producer`.
6. **Eligibility states and next-turn calculation** — `check_eligibility_round_robin`.
7. **Do not equate producer turns with identical rewards** — this package deliberately limits its claim to block-producer selection; later reward functions in the same file apply time-aged multiplier logic.