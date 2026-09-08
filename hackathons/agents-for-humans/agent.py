from __future__ import annotations

import json
import os
import re
from typing import Literal, TypedDict

from strands import Agent, tool


class Finding(TypedDict):
    severity: Literal["info", "warn", "block"]
    message: str


class PreflightResult(TypedDict):
    decision: Literal["PASS", "WARN", "BLOCK"]
    findings: list[Finding]
    human_decision_required: bool


def _offline_preflight(asset: str, channel: str) -> PreflightResult:
    """Credential-free demo evaluator for the hackathon branch.

    Production can replace this body with the live NexusEval route while
    keeping the Strands tool contract stable.
    """
    text = asset.strip()
    findings: list[Finding] = []

    if not text:
        findings.append({"severity": "block", "message": "Asset is empty."})

    claim_patterns = [
        r"\bguaranteed\b",
        r"\b100%\b",
        r"\bbest in the world\b",
        r"\bno risk\b",
    ]
    if any(re.search(pattern, text, re.I) for pattern in claim_patterns):
        findings.append(
            {
                "severity": "warn",
                "message": "Strong performance/absolute claim detected; verify evidence or soften wording.",
            }
        )

    cta_markers = ["buy", "book", "start", "try", "reply", "schedule", "download", "learn more"]
    if text and not any(marker in text.lower() for marker in cta_markers):
        findings.append(
            {
                "severity": "warn",
                "message": f"No clear next action detected for {channel}.",
            }
        )

    if len(text) > 2400:
        findings.append(
            {
                "severity": "info",
                "message": "Asset is long for a rapid preflight; consider a shorter variant.",
            }
        )

    if any(f["severity"] == "block" for f in findings):
        decision: Literal["PASS", "WARN", "BLOCK"] = "BLOCK"
    elif any(f["severity"] == "warn" for f in findings):
        decision = "WARN"
    else:
        decision = "PASS"

    return {
        "decision": decision,
        "findings": findings,
        "human_decision_required": decision != "PASS",
    }


@tool
def marketing_preflight(asset: str, channel: str = "general") -> str:
    """Run a marketing asset through a PASS/WARN/BLOCK preflight.

    Args:
        asset: The exact marketing copy or asset text to check.
        channel: Intended surface such as email, landing_page, ad, or gtm.

    Returns:
        JSON with decision, findings, and whether a human decision is required.
    """
    result = _offline_preflight(asset, channel)
    return json.dumps(result, ensure_ascii=False)


SYSTEM_PROMPT = """
You are NexusEval Professional Agent, a background marketing preflight worker.
Your job is to reduce repetitive review work without pretending uncertain work
is safe. For each supplied asset:

1. Use marketing_preflight exactly once for the requested asset.
2. If the tool returns PASS, give a concise release-ready confirmation.
3. If it returns WARN or BLOCK, surface only the material findings and ask the
   human for the smallest decision needed.
4. Never invent evidence, customer results, compliance approval, or a successful
   payment. Do not make irreversible publishing decisions on behalf of the user.
""".strip()


def build_agent() -> Agent:
    """Construct the Strands agent.

    Strands uses its configured/default model provider. The hackathon entrant
    can set the provider/credentials according to the official Strands docs.
    """
    return Agent(system_prompt=SYSTEM_PROMPT, tools=[marketing_preflight])


if __name__ == "__main__":
    demo_asset = os.environ.get(
        "NEXUSEVAL_DEMO_ASSET",
        "Our platform guarantees 100% better campaign results. Learn more today.",
    )
    channel = os.environ.get("NEXUSEVAL_DEMO_CHANNEL", "landing_page")
    agent = build_agent()
    result = agent(
        f"Run the professional marketing preflight for this {channel} asset:\n\n{demo_asset}"
    )
    print(result)
