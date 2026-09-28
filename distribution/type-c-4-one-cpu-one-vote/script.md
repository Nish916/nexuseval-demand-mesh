# Script — ~50–55 seconds

**Hook:** “One CPU equals one vote” in RustChain is not a hashrate race.

The current RIP-200 implementation first selects miners with valid recent attestation and orders them deterministically.

For block production, the function is simple: take the current slot number modulo the number of attested miners. That index chooses the producer.

The source comments are explicit: each attested CPU gets exactly one turn per rotation cycle. No lottery. No probabilistic selection.

If a miner is not attested, it is not eligible for the rotation. If it is attested but this is not its turn, the code calculates the next slot where its turn arrives.

That is producer selection. Reward distribution can still use antiquity weighting separately.

**End card:** Real source. Deterministic rotation. No fake benchmark claims.