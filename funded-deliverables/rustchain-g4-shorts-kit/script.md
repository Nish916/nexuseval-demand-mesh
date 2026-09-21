# Script — “Why a 2003 Mac Gets a Higher Mining Multiplier”

**Target runtime:** 48–55 seconds at ~145–160 wpm

**0:00–0:05 — Hook**  
A 2003 PowerPC G4 gets a higher RustChain mining multiplier than modern x86 hardware. That sounds backwards — and it is intentional.

**0:05–0:16 — Show the numbers**  
RustChain’s own hardware table lists the PowerPC G4 at **2.5x**, while modern x86_64 is **0.8x**. The project calls its model **Proof of Antiquity**.

**0:16–0:31 — Explain the mechanism, carefully**  
Instead of rewarding only raw speed, RustChain says it verifies physical machines using signals such as oscillator drift, cache timing, SIMD identity, thermal entropy, instruction jitter, and anti-emulation checks.

**0:31–0:44 — Why that matters**  
The design goal is to make old, real hardware an asset instead of e-waste — and make a virtual machine pretending to be vintage hardware harder to pass off as genuine.

**0:44–0:53 — Close**  
So the surprising claim is not “a G4 is faster.” It is: **age and physical provenance are part of the reward rule.** The public implementation and hardware table are linked below.

**On-screen final card:**  
`PowerPC G4: 2.5x | modern x86_64: 0.8x`  
`Source: github.com/Scottcjn/Rustchain`
