# Sources — Type C #5

Primary source:
https://github.com/Scottcjn/Rustchain/blob/main/miners/linux/fingerprint_checks.py

Verified source blob SHA: `02cc1aecf96dc6bf173c714135ff6481137bd0af`.

Claim map:
1. **Clock drift** — `check_clock_drift`.
2. **Cache timing** — `check_cache_timing`.
3. **SIMD identity** — `check_simd_identity`.
4. **Thermal drift entropy** — `check_thermal_drift`.
5. **Instruction path jitter** — `check_instruction_jitter`.
6. **Anti-emulation signals** — `check_anti_emulation`; current code checks DMI/system strings, environment markers, CPU hypervisor flag, `/sys/hypervisor/type`, cloud metadata and `systemd-detect-virt` where applicable.
7. **ROM fingerprint is conditional** — `check_rom_fingerprint` plus `validate_all_checks(include_rom_check=True)`; the validator appends the ROM check only if `ROM_DB_AVAILABLE`.
8. **No claim that every run has exactly seven checks** — the source itself makes check 7 conditional.

Accuracy rule for publication: any terminal result must come from a real run and be shown verbatim or explicitly labelled as illustrative.