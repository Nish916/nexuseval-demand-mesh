# NexusEval Professional Agent — Agents for Humans

Status: build branch; Devpost registration/submission not yet completed.

## One-line pitch

A Strands-powered professional agent that quietly runs a marketing preflight before a human sends or publishes an ad, landing page, launch email, campaign brief, or GTM asset — escalating only when the result is WARN/BLOCK or materially ambiguous.

## Problem

Marketing teams repeat the same high-friction checks across every asset: claims, CTA clarity, missing evidence, risky wording, launch readiness, and cross-channel consistency. Humans either skip the check or spend time re-reading routine material.

## Agent behavior

1. Receive a real asset plus its intended channel.
2. Decide whether a preflight is justified.
3. Call the smallest matching QA tool.
4. Return structured PASS/WARN/BLOCK findings.
5. Auto-clear PASS results.
6. Surface WARN/BLOCK to the human with the smallest decision needed.

The agent is designed around the hackathon theme: do repetitive professional work in the background and involve the human only for judgment-heavy decisions.

## Strands integration

The Python seed uses the current Strands SDK pattern (`from strands import Agent, tool`) with a custom `marketing_preflight` tool. The default code path is deterministic/offline so the repository can be reviewed without credentials. A production adapter can replace the deterministic evaluator with NexusEval's live paid or direct API route.

## What is pre-existing vs hackathon-period work

Pre-existing NexusEval assets:
- PASS/WARN/BLOCK marketing QA concept
- commercial API routes / machine-readable buyer policies
- x402 discovery experiments

Hackathon branch work:
- Strands agent wrapper
- professional-agent autonomous flow
- human-escalation policy
- submission/demo packaging

## Next

- wire a permitted model provider for the Strands agent
- connect the tool to a live NexusEval route in a credential-safe way
- add trace/metrics output for the demo
- record a real before/after asset workflow
- complete Devpost registration and official submission through the entrant account
