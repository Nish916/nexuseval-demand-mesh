# Sources

Pinned rustchain-mcp source state:  
https://github.com/Scottcjn/rustchain-mcp/tree/4a67cc1037b5f02c4075ae65c241985b3839278a

## Claim map

### Successful zero is valid data; failed lookup must not collapse to zero
README — Stable Error Responses for Agent Clients:  
https://github.com/Scottcjn/rustchain-mcp/blob/4a67cc1037b5f02c4075ae65c241985b3839278a/README.md#stable-error-responses-for-agent-clients

Relevant text includes the explicit successful-zero example and the instruction that failed balance lookup should never be collapsed to 0 RTC.

### `wallet_balance` exists and routes through the balance lookup logic
Source: `rustchain_mcp/server.py`  
https://github.com/Scottcjn/rustchain-mcp/blob/4a67cc1037b5f02c4075ae65c241985b3839278a/rustchain_mcp/server.py

### Documented stable error codes
README documents examples including:
- `UPSTREAM_TIMEOUT`
- `INVALID_IDENTIFIER`
- `NON_JSON_RESPONSE`
- `MISSING_EXPECTED_FIELD`
- `NODE_UNAVAILABLE`
- `RATE_LIMITED`
- `TRANSPORT_RETRYABLE`

Source:  
https://github.com/Scottcjn/rustchain-mcp/blob/4a67cc1037b5f02c4075ae65c241985b3839278a/README.md#stable-error-responses-for-agent-clients

### Invalid identifier behavior is covered in tests
Test source: `tests/test_github_failure_not_empty.py`  
https://github.com/Scottcjn/rustchain-mcp/blob/4a67cc1037b5f02c4075ae65c241985b3839278a/tests/test_github_failure_not_empty.py

## Editorial boundaries
This package does not claim:
- that every listed error code appears in every tool,
- that RTC has a market price or off-ramp,
- that any balance belongs to a specific user,
- or that a documented example is a captured live production response.
