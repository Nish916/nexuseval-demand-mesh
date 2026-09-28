# Narration Script — 1 CPU = 1 Vote ≠ Equal Rewards

**Target runtime:** ~4:30  
**Editorial rule:** “multiplier” means reward weight, not benchmark speed or guaranteed income.

## 0:00–0:25 — Hook
RustChain has two rules that sound similar until you separate them. The first is **one physical CPU, one vote**. The second is that verified hardware can carry a different **reward weight** based on its antiquity. One controls who can participate as a distinct hardware identity. The other influences how the epoch reward is allocated.

## 0:25–1:05 — Why identity comes first
The Proof-of-Antiquity specification calls hardware attestation the enforcement layer for RIP-200’s one-CPU-one-vote round-robin consensus. Without attestation, one powerful machine could create many virtual machines and pretend to be many independent miners.

The protocol therefore does not rely only on a CPU name typed by the client. A miner submits physical measurements, and the server re-evaluates the raw evidence. The specification covers timing drift, cache behavior, SIMD identity, thermal behavior, instruction jitter, device-age evidence, anti-emulation checks, and ROM analysis for relevant retro systems.

## 1:05–1:45 — After attestation
When attestation passes, the node records the miner as fingerprint-passed and auto-enrolls it for the current epoch. The enrollment **weight** is the miner’s time-aged antiquity multiplier.

Attestation is temporary. The published specification sets its validity to **86,400 seconds — 24 hours** — so current hardware evidence must remain fresh.

## 1:45–2:30 — Round robin versus reward weight
Think of the system as two questions.

**Who gets a seat?** Hardware attestation is designed to make each seat correspond to a distinct physical CPU, supporting RIP-200’s round-robin model.

**How is the epoch reward weighted?** The Proof-of-Antiquity specification describes epoch settlement as **1.5 RTC per epoch, weighted by antiquity multiplier**.

So “one CPU, one vote” does not mean every verified CPU has the same reward weight. The participation identity is one-per-CPU; reward allocation can still distinguish hardware eras.

## 2:30–3:10 — Concrete example
The current multiplier table gives a PowerPC G4 a base multiplier of **2.5×**. Generic modern Intel or AMD x86 is listed at **0.8×**. Those numbers are reward weights in the antiquity table. They are **not** claims that a G4 computes 2.5 times faster, produces a fixed amount of cash, or guarantees a return.

The specification also describes antiquity multipliers as time-decaying. The story is not “old hardware gets an ever-growing bonus forever.”

## 3:10–3:55 — Why measurements matter
The attestation server does not simply accept a client’s `passed: true`. The spec says it re-evaluates raw fingerprint data and cross-validates device claims. Anti-emulation evidence is the minimum required evidence in the server-side validation section.

The server can override a self-reported architecture when evidence contradicts it. SIMD capabilities and CPU-brand evidence help distinguish x86, ARM and PowerPC claims.

For privacy, the design goals specify epoch-scoped hashing for MAC addresses rather than relying on a permanent raw MAC identifier.

## 3:55–4:30 — Takeaway
The shortest accurate mental model is:

**One physical CPU, one network identity. Hardware attestation decides whether the identity is real. Round-robin consensus governs participation. Antiquity weighting influences reward share.**

Keeping those layers separate avoids two mistakes: treating the multiplier as a speed benchmark, or assuming one-CPU-one-vote requires identical payouts.

RustChain’s unusual idea is not that vintage computers are faster. It is that verifiable physical hardware history can be treated as a scarce network property while the network tries to stop virtual copies from multiplying that identity.
