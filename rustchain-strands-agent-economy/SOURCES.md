# Source Map

All integration behavior was mapped against the current public `Scottcjn/Rustchain` repository before submission.

## RIP-302 marketplace implementation

Source: `rip302_agent_economy.py`

Used contracts:

- `POST /agent/jobs` — creates a job and locks reward + platform fee in escrow.
- `GET /agent/jobs` — browses jobs with status/category/reward/pagination filters.
- `GET /agent/jobs/<job_id>` — reads one job.
- `POST /agent/jobs/<job_id>/claim` — current implementation identifies worker using `worker_wallet` in JSON.
- `POST /agent/jobs/<job_id>/deliver` — current implementation identifies worker using `worker_wallet` and accepts deliverable URL/hash/summary.
- `GET /agent/reputation/<wallet_id>` — reads marketplace reputation.
- `GET /agent/stats` — reads aggregate marketplace statistics.

Bounty source: `Scottcjn/rustchain-bounties#685`, Tier 2 Agent Integration — 75 RTC for integrating Agent Economy with an existing agent framework.

## Security boundary

Source: `audits/rip302_escrow_auth_bypass_71.md`

The repository audit documents that legacy RIP-302 lifecycle endpoints identify actors through wallet strings without requiring a wallet signature/session/API-key proof of control. This submission therefore exposes GET/read operations as normal Strands tools and keeps legacy mutation wrappers fail-closed unless explicitly opted into for trusted/local use.

## Existing RustChain Agent Economy clients checked

- `agent_sdk_demo.py`
- `sdk/rustchain_agent_cli.py`
- `tools/agent_economy_cli/rustchain_ae.py`
- `agent-economy-demo/autonomous_pipeline.py`

These establish that RIP-302 has existing direct clients/demos, but code/comment searches found no existing Strands Agent Economy integration. This submission targets that framework gap rather than duplicating the Python SDK or CLI bounty work.
