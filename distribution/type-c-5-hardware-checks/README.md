# RustChain Type C Shorts Kit #5 — Hardware Fingerprint Checks

Bounty: Scottcjn/rustchain-bounties#16601  
Contributor: @Nish916  
RTC wallet: `RTCbc589ef246bc1c5c8c44117f1d66b226f33b9f73`

**Working title:** The Hardware Checks RustChain Actually Runs

A <=60s technical short grounded in `miners/linux/fingerprint_checks.py`.

Important accuracy point: the file defines **six always-listed behavioral/timing checks**, and it can add a **seventh ROM fingerprint check when the ROM database is available**. This kit does not incorrectly claim that every run always has exactly six or exactly seven checks.

Storyboard requires either direct source capture or a real local run captured verbatim. It forbids reconstructed “PASS” output.