# Storyboard — 16:9 capture plan

Canvas: **1920×1080**. Final thumbnail assets are 1280×720. No third-party footage is required.

| Time | Visual | Exact capture / construction |
|---|---|---|
| 0:00–0:10 | Split screen: “0 RTC” vs “ERROR” | Create two terminal-style cards. Left shows a successful JSON example with `amount_rtc: 0`; right shows `ok: false`. Label “NOT THE SAME STATE”. |
| 0:10–0:25 | Agent decision tree | Simple diagram: BALANCE CHECK → ZERO / POSITIVE / ERROR. Keep ERROR branch visually separate. |
| 0:25–0:50 | Public README capture | Open pinned `rustchain-mcp/README.md` at “Stable Error Responses for Agent Clients.” Highlight the sentence that successful zero and failed lookup differ. |
| 0:50–1:20 | Tool names | Capture README/tool list and source for `wallet_balance` / `rustchain_balance`. No reconstructed terminal output. |
| 1:20–1:50 | Error envelope | Build an editor-rendered JSON card using the documented shape: `ok: false`, `error.code`, `retryable`, `source`, `details`. Clearly label “DOCUMENTED SHAPE,” not live output. |
| 1:50–2:35 | Code cards | Cycle through 4 large labels: INVALID_IDENTIFIER, UPSTREAM_TIMEOUT, RATE_LIMITED, NON_JSON_RESPONSE. Under each, show the safe next action. |
| 2:35–3:15 | Silent-success failure animation | Request icon fails → careless adapter writes “0” → agent makes decision. Overlay red stamp: “VALUE WAS NEVER OBSERVED.” |
| 3:15–3:55 | Three-way policy | Full-screen flowchart: SUCCESS+0 → REAL ZERO; SUCCESS+N → OBSERVED BALANCE; ok:false → ERROR/RETRY/WARN/STOP. |
| 3:55–4:30 | Source close | Return to pinned README and source links. End card: “ZERO IS DATA. ERROR IS UNCERTAINTY.” |

## Capture constraints
- Use only public GitHub pages from SOURCES.md.
- Any JSON not copied from a real response must be labelled “documented example.”
- Never display API keys, private keys, seed phrases, signed payloads, or private user data.
- Do not present RTC as cash, an investment, or a guaranteed-value asset.
