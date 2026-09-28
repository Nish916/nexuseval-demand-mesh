# Storyboard / exact capture instructions

Canvas: **1080×1920, 9:16**, 30 fps or 60 fps. No third-party footage required.

| Time | Visual / capture instruction | On-screen text |
|---|---|---|
| 0–4s | Black terminal-style background. Animate two labels side by side: ACCEPTED → ? → SETTLED. | “Accepted ≠ settled” |
| 4–14s | Capture the public `scripts/bounty_payout.py` lines where `phase=resp.get("phase","")` is read and the `phase=="pending"` branch begins. Highlight only those lines. | “phase: pending” |
| 14–25s | Scroll/crop to the source comment explaining the two-phase transfer and that the balance moves when the pending confirmer runs. | “Queued, not sent” |
| 25–36s | Highlight `confirms_in_hours` with the default value `24`. Avoid presenting 24h as immutable; add “default / node may report another value.” | “~24h default window” |
| 36–46s | Simple three-step diagram created in-editor: WORK ACCEPTED → TRANSFER QUEUED → SETTLED. | “Track the state” |
| 46–55s | Return to terminal capture. Zoom on `tx_hash`, `phase`, and the word `pending`. | “Verify phase + tx identity” |

### Capture rules
- Use the pinned source URL from `SOURCES.md`.
- Do not fabricate terminal output.
- Do not show a wallet balance or claim payment happened unless it is a real public record.
- No price chart, dollar conversion, investment language, or guaranteed-earnings wording.
