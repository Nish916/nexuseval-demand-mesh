# LaunchGuard — Professional Agent for Repetitive Marketing QA

Target: AWS / Devpost **Agents for Humans Hackathon**, Professional Agents track.

## Problem
Marketing teams repeatedly review launch assets for unsupported claims, missing disclosures, inconsistent CTAs, risky urgency language, broken handoffs, and launch-readiness issues. The work is repetitive but still judgment-heavy.

## Agent
**LaunchGuard** is a Strands Agents SDK professional agent that accepts a launch artifact or campaign brief, runs a structured preflight, and stays quiet when the asset is safe. It surfaces only when a human decision is needed.

Core behavior:
1. Classify the artifact and choose the smallest applicable QA check.
2. Detect claims/disclosure/CTA/readiness risks.
3. Return PASS when no action is needed.
4. Return WARN with specific edits for reviewable risk.
5. Return BLOCK for missing evidence or unsafe launch conditions.
6. Keep an audit record of what was checked and why it surfaced.

## Why this fits the Professional Agents track
The agent removes recurring review work from marketers, creators and small-business operators while preserving human judgment for consequential decisions.

## Reuse from NexusEval
- PASS / WARN / BLOCK decision model
- machine-readable offer catalog
- smallest-route selection
- duplicate-spend protection
- structured evidence output
- existing marketing-preflight use cases

## Files
- `launchguard.py` — Strands agent scaffold
- `requirements.txt` — SDK dependencies
- `SUBMISSION.md` — demo and judging narrative

## Submission status
Build preparation only. Joining/submitting on Devpost constitutes acceptance of the hackathon rules, so the external registration/submission step must be completed through an authorized Devpost account. No prize is counted until an actual award is confirmed.