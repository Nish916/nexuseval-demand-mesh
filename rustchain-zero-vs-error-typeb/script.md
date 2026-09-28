# Script — Zero Is Data. Error Is Uncertainty.

**Target runtime:** 4:15–4:45  
**Audience:** agent builders, MCP users, automation engineers

## 0:00–0:25 — Hook

Imagine an autonomous agent checking its RustChain wallet before taking a job. The network request fails. If the tool turns that failure into “0 RTC,” the agent learns the wrong fact. It might stop useful work, claim it cannot pay gas, or report an empty wallet that was never actually observed.

That is the difference this video is about: **zero is data; error is uncertainty.**

## 0:25–1:05 — Two outcomes that look similar to a careless client

A genuine zero balance is a successful observation. The current rustchain-mcp documentation gives an explicit zero-value shape: an `amount_rtc` of zero with the wallet or miner identity attached.

A failed lookup is different. The upstream node might time out. It might return HTML instead of JSON. A wallet identifier might be malformed. A service might return a 5xx response. None of those events proves the balance is zero.

So a reliable agent interface must preserve that distinction.

## 1:05–1:50 — What rustchain-mcp does

The current `wallet_balance` and `rustchain_balance` tools route through a shared balance lookup helper. The public documentation says failed balance and miner lookups should return a predictable error object rather than a successful zero-value result.

The documented error envelope includes an `ok: false` state and a machine-readable code. Examples include `UPSTREAM_TIMEOUT`, `INVALID_IDENTIFIER`, `NON_JSON_RESPONSE`, `MISSING_EXPECTED_FIELD`, `NODE_UNAVAILABLE`, `RATE_LIMITED`, and `TRANSPORT_RETRYABLE`.

Those codes matter because agents should branch on stable state, not scrape prose.

## 1:50–2:35 — Why retryability matters

Not every failure should trigger the same action.

If the identifier is invalid, retrying the same input is pointless. The agent should fix the input or ask for a valid wallet ID.

If a network request times out, retrying later can make sense.

If a service rate-limits the client and provides a usable retry window, the agent can schedule a later attempt.

If the upstream returned non-JSON content where structured data was required, the agent should treat the response as untrusted instead of guessing.

The point is not that every code is perfect forever. The point is that the interface makes uncertainty explicit enough for automation to make a safe next decision.

## 2:35–3:15 — Why “0 on error” is dangerous

Collapsing failure to zero creates a silent-success bug.

The API call returns something that looks like valid business data. The workflow stays green. The agent makes a decision. But the value was fabricated by the client’s error handling, not observed from the network.

This is especially dangerous in autonomous systems because the next action may be several steps downstream. By the time a human notices, the original transport failure has disappeared from the audit trail.

A visible error is inconvenient. A believable false value is worse.

## 3:15–3:55 — A simple client policy

A robust agent can use a three-way policy:

First, if the response is successful and `amount_rtc` is zero, record a real zero.

Second, if the response is successful and the amount is positive, record that observed value.

Third, if `ok` is false, do not invent a balance. Record the error code, decide whether it is retryable, and either retry, warn, or stop.

That policy is small, but it prevents an entire class of false-state automation.

## 3:55–4:30 — Close

This is a useful design lesson beyond RustChain.

When an agent depends on an external system, “I observed zero” and “I failed to observe a value” are not equivalent states.

Rustchain-mcp’s current balance contract documents that distinction explicitly: a real zero remains a valid result, while lookup failure remains an error object.

For autonomous agents, honest uncertainty is a feature.

Source links are in the description and the package SOURCES file.

**Disclosure:** This package was prepared with AI assistance and checked against the pinned public source.
