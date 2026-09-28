# Script — ~55 seconds

**Hook:** RustChain does not identify physical hardware with one number.

Its current Linux fingerprint validator combines several independent signals.

It measures clock and oscillator drift, cache timing behavior, SIMD identity, thermal drift entropy, and instruction-path jitter.

Then it runs anti-emulation checks that look for VM or cloud indicators across system metadata, CPU flags, environment signals, hypervisor files, and cloud metadata endpoints.

There is also a ROM fingerprint check for retro platforms. The validator only adds that seventh check when the ROM fingerprint database is available.

The point is cross-checking different physical and behavioral signals — not trusting one benchmark.

For the visual proof, use the real source or run the script on real hardware and capture its output verbatim. Do not reconstruct a fake “all passed” screen.

**End card:** Source in description.