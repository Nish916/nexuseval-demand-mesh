from __future__ import annotations

import json
import re
from dataclasses import dataclass, asdict

from strands import Agent, tool


@dataclass
class PreflightResult:
    decision: str
    issues: list[str]
    suggested_fixes: list[str]
    needs_human: bool


ABSOLUTE_CLAIMS = [
    r"\bguaranteed\b",
    r"\b100%\b",
    r"\bbest\b",
    r"\bfastest\b",
    r"\bnumber\s*1\b",
]


@tool
def marketing_preflight(asset_text: str) -> str:
    """Review marketing copy and return a structured PASS/WARN/BLOCK preflight."""
    text = asset_text.strip()
    issues: list[str] = []
    fixes: list[str] = []

    if not text:
        result = PreflightResult(
            decision="BLOCK",
            issues=["No launch artifact was supplied."],
            suggested_fixes=["Provide the actual copy, landing-page text, ad, or campaign brief."],
            needs_human=True,
        )
        return json.dumps(asdict(result))

    for pattern in ABSOLUTE_CLAIMS:
        if re.search(pattern, text, flags=re.I):
            issues.append(f"Potentially unsupported absolute claim matched: {pattern}")

    if issues:
        fixes.append("Replace absolute claims with specific, supportable language or attach substantiation.")

    if re.search(r"\b(limited time|act now|last chance)\b", text, flags=re.I):
        issues.append("Urgency language should be checked against the actual offer window or inventory.")
        fixes.append("Verify urgency is factually true and document the deadline or inventory basis.")

    if re.search(r"\b(results|returns|profit|earnings)\b", text, flags=re.I) and not re.search(
        r"\b(may|can|varies|not guaranteed|results vary)\b", text, flags=re.I
    ):
        issues.append("Outcome/earnings language appears without an obvious qualification.")
        fixes.append("Add an appropriate qualification and link the claim to evidence where applicable.")

    decision = "PASS" if not issues else "WARN"
    result = PreflightResult(
        decision=decision,
        issues=issues,
        suggested_fixes=fixes,
        needs_human=bool(issues),
    )
    return json.dumps(asdict(result))


SYSTEM_PROMPT = """
You are LaunchGuard, a professional marketing QA agent.
Your job is to remove repetitive pre-launch review work without making consequential decisions for the human.
Use marketing_preflight on the supplied launch asset.
If the result is PASS, answer compactly and do not manufacture concerns.
If WARN or BLOCK, surface the exact issues and suggested fixes.
Never claim legal approval, guaranteed compliance, guaranteed performance, or guaranteed revenue.
""".strip()


agent = Agent(system_prompt=SYSTEM_PROMPT, tools=[marketing_preflight])


if __name__ == "__main__":
    demo = (
        "Our platform guarantees the fastest growth in the market. "
        "Act now and double your results."
    )
    response = agent(f"Preflight this campaign copy before launch:\n\n{demo}")
    print(response)
