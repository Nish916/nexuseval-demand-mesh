# Storyboard / exact capture instructions

Format: 1080x1920 or 720x1280, <=60s. Do not invent terminal output.

| Time | Visual | Exact capture instruction |
|---|---|---|
| 0–5s | Hook | Large text: “Vintage bonus ≠ grows forever” over neutral code-background animation. |
| 5–13s | G4 multiplier | Screen-record the public GitHub source `node/rip_200_round_robin_1cpu1vote.py`; scroll to the PowerPC Mac table and visibly highlight `"g4": 2.5`. |
| 13–23s | Decay constant | In the same real source page, move to `DECAY_RATE_PER_YEAR = 0.15`. Zoom only; do not retype or reconstruct it. |
| 23–37s | Formula | Capture the real `get_time_aged_multiplier` function, including `vintage_bonus = base_multiplier - 1.0` and `aged_bonus = max(0, vintage_bonus * (1 - DECAY_RATE_PER_YEAR * chain_age_years))`. |
| 37–47s | Penalties stay penalties | Capture the branch `if base_multiplier < 1.0: return base_multiplier`. Overlay: “Sub-1.0 penalties do not decay upward.” |
| 47–55s | Close | End card: “Temporary vintage weighting. Explicit decay. Source in description.” |

Rights: all captures are of the public MIT-licensed RustChain repository or original text/graphics created for this kit.