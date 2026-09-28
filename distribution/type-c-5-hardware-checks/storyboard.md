# Storyboard / exact capture instructions

Format: vertical 9:16, <=60s.

| Time | Visual | Exact capture instruction |
|---|---|---|
| 0–5s | Hook | Original text: “One fingerprint? No — multiple independent checks.” |
| 5–20s | Checks 1–5 | Capture the top of `miners/linux/fingerprint_checks.py` and then the actual function names: `check_clock_drift`, `check_cache_timing`, `check_simd_identity`, `check_thermal_drift`, `check_instruction_jitter`. |
| 20–34s | Anti-emulation | Capture `check_anti_emulation`; scroll through examples of DMI/CPU/environment/hypervisor/cloud-metadata signals. Do not claim any specific machine failed unless showing a real run. |
| 34–44s | Optional ROM check | Capture `check_rom_fingerprint` and the `ROM_DB_AVAILABLE` branch. Overlay: “Retro ROM check is conditional.” |
| 44–54s | Validator | Capture `validate_all_checks`: six standard checks plus conditional ROM append when `include_rom_check and ROM_DB_AVAILABLE`. |
| 54–59s | Close | “Use real output verbatim — no reconstructed PASS screen.” |

If a human publisher wants terminal footage, run:
`python3 miners/linux/fingerprint_checks.py`
on a real machine and record the actual stdout. It is acceptable to trim the detailed JSON section only if the edit is disclosed; do not rewrite labels/results.