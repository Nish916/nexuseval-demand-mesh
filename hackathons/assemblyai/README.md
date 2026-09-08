# LaunchGuard Voice — Speak Your Campaign, Get a Preflight

Target: AssemblyAI Voice Agent Hackathon, Sep 1–30 2026.

## Product
A marketer speaks a launch idea, ad script, email draft, or landing-page pitch. AssemblyAI transcribes the voice input, LaunchGuard runs the same structured marketing preflight used by NexusEval, and the agent returns a compact PASS/WARN/BLOCK response with the exact sentence that needs human attention.

## Why voice
Creators and small-business operators often think through campaigns verbally before the copy is finalized. This moves QA earlier: talk through the idea, catch risky or unsupported claims, then write/publish.

## Core pipeline
`microphone/audio -> AssemblyAI transcription -> LaunchGuard preflight -> decision + evidence -> spoken/visual response`

## Demo
1. User says: “Launch this tomorrow. We guarantee the fastest growth and double your results.”
2. Transcription is passed to the preflight engine.
3. Agent returns WARN, flags the guarantee/performance language, and suggests evidence-backed alternatives.
4. Clean copy returns PASS without unnecessary interruption.

## Reuse
- Existing LaunchGuard/NexusEval PASS-WARN-BLOCK logic
- Same evidence schema
- Same no-fake-guarantee policy
- Same human-escalation rule

## Submission status
Build-ready concept scaffold. AssemblyAI/lablab account registration and submission remain external account actions; no prize or entry status is claimed until platform submission is actually completed.