from __future__ import annotations

import json
import os
from typing import Any

from strands import Agent, tool

from client import AgentEconomyClient, AgentEconomyError


NODE_URL = os.environ.get("RUSTCHAIN_NODE", "https://rustchain.org")
_client = AgentEconomyClient(base_url=NODE_URL)


def _dump(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


@tool
def browse_agent_jobs(
    status: str = "open",
    category: str = "",
    min_reward_rtc: float = 0.0,
    limit: int = 20,
) -> str:
    """Browse current RIP-302 Agent Economy jobs without mutating chain state.

    Args:
        status: Job status, normally open.
        category: Optional category such as code, research, testing, or writing.
        min_reward_rtc: Minimum advertised RTC reward.
        limit: Maximum number of jobs to request, 1-100.

    Returns:
        JSON response from the RustChain Agent Economy marketplace.
    """
    try:
        return _dump(
            _client.list_jobs(
                status=status,
                category=category or None,
                min_reward=min_reward_rtc,
                limit=limit,
            )
        )
    except (AgentEconomyError, ValueError) as exc:
        return _dump({"ok": False, "error": str(exc)})


@tool
def inspect_agent_job(job_id: str) -> str:
    """Read one RIP-302 job, including its current lifecycle state and details."""
    try:
        return _dump(_client.get_job(job_id))
    except (AgentEconomyError, ValueError) as exc:
        return _dump({"ok": False, "error": str(exc)})


@tool
def inspect_agent_reputation(wallet_id: str) -> str:
    """Read a RustChain Agent Economy reputation profile for a wallet/agent."""
    try:
        return _dump(_client.reputation(wallet_id))
    except (AgentEconomyError, ValueError) as exc:
        return _dump({"ok": False, "error": str(exc)})


@tool
def inspect_agent_economy_stats() -> str:
    """Read aggregate RIP-302 marketplace statistics."""
    try:
        return _dump(_client.stats())
    except AgentEconomyError as exc:
        return _dump({"ok": False, "error": str(exc)})


SYSTEM_PROMPT = """
You are a RustChain Agent Economy discovery assistant implemented with the
Strands Agents SDK. Use the RIP-302 read tools to find legitimate work that
matches the user's requested skills, reward floor, and category.

Rules:
- Never claim that a job is funded, claimable, accepted, delivered, or paid
  unless the corresponding tool response proves that state.
- Treat rewards as RTC-denominated values, not guaranteed fiat value.
- Do not fabricate wallet identities or counterparties.
- This integration is read/discovery safe-by-default because the reviewed
  upstream RIP-302 mutation routes currently identify actors by wallet strings
  without cryptographic caller authentication. Do not instruct yourself to
  bypass that safety boundary.
- Return the smallest useful shortlist, including exact job IDs and status.
""".strip()


def build_agent() -> Agent:
    return Agent(
        system_prompt=SYSTEM_PROMPT,
        tools=[
            browse_agent_jobs,
            inspect_agent_job,
            inspect_agent_reputation,
            inspect_agent_economy_stats,
        ],
    )


if __name__ == "__main__":
    prompt = os.environ.get(
        "RIP302_DEMO_PROMPT",
        "Find open code, testing, or research jobs paying at least 5 RTC and summarize the best matches.",
    )
    print(build_agent()(prompt))
