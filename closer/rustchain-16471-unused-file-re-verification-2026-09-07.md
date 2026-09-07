# RustChain #16471 — acceptance-ready finding

Target bounty: https://github.com/Scottcjn/rustchain-bounties/issues/16471
Verified open on 2026-09-07.
Reward: 35 RTC for the audit + 10 RTC per confirmed defect beyond the first, uncapped.
Current source checked: `Scottcjn/rustchain-bounties@c5ce8770de07e5dbb4dfbac9a63f0e854de8a6c9`.
Payout identity: `Nish916`.

## Finding

### `docstring_gate.py` promises to verify the claimed file, but `FILE_RE` is dead code — docstrings in unrelated files can satisfy and pay the claim

The gate's own contract says it verifies **“The PR touches the claimed file”** before payout. It defines `FILE_RE` for extracting a claimed `.py` path, but `FILE_RE` is never referenced after its definition. The gate instead runs `count_added_docstrings(diff)` across the entire PR, accepts the aggregate `doc_count`, and later applies `bounty-eligible` + `docstring-verified` from that repo-wide count.

## Concrete wrong-effect path

1. A merged PR changes `unrelated.py` and adds one valid docstring there.
2. The bounty claim names a different file, e.g. `critical.py`, and says one function was documented.
3. The gate never extracts or checks `critical.py`; `count_added_docstrings()` sees the one docstring in `unrelated.py` and returns `doc_count=1`.
4. Assuming the normal weekly/per-claim caps pass, the verified branch applies the payable labels, posts `<!-- rtc-payout-amount: 0.01 -->`, and exits 0.
5. The public result says the claim was verified even though acceptance criterion #2 (“PR touches the claimed file”) was never established.

This is distinct from the already-reported no-op triple-quoted-string finding: here the counted docstring can be a completely legitimate Python docstring; the defect is that it may be in the wrong file because the claimed-file validator is never executed.

## Safe verification evidence

- `FILE_RE` has exactly one current code-search occurrence: its definition in `scripts/docstring_gate.py`.
- `count_added_docstrings(diff)` aggregates docstrings across every `+++ b/...` file in the PR.
- The verified branch uses only aggregate `doc_count` and `files`; it never compares a parsed claimed file against the changed files.
- No production calls, funds, credentials, wallet signatures, or private keys were used.

## Suggested fix

Parse the claimed path with `FILE_RE`, require that exact normalized path to appear in the PR, and count payable docstrings only within that file. If the claim does not name a resolvable file, hold it for human review rather than auto-paying.

## Regression test

Create a synthetic merged-PR diff where:

- claim body names `critical.py` and claims one documented function;
- PR changes only `unrelated.py`;
- `unrelated.py` contains one genuine function docstring.

Expected: no `bounty-eligible` or `docstring-verified` labels and no `rtc-payout-amount` marker.

Current behavior: aggregate `doc_count == 1`, so the payable path can be reached despite the claimed file never being touched.

## Acceptance checklist

- [x] Bounty independently verified open and funded.
- [x] Finding is in explicit bounty scope (`scripts/docstring_gate.py`).
- [x] Concrete success-with-wrong-effect path documented.
- [x] Current-main source evidence checked.
- [x] Duplicate census of #16471 thread found no existing claimed-file / unused-`FILE_RE` report.
- [x] Deterministic regression shape supplied.
- [x] Zero spend, no signatures, no KYC/legal acceptance, no production access.

## Closer submission

Preferred submission is a comment on bounty issue #16471 using the Finding + Concrete path + Suggested fix + Regression test sections above, ending with:

`Payout identity: existing authenticated GitHub handle Nish916. No acceptance, payout, or settlement is asserted until maintainer confirmation and canonical RTC evidence.`

Execution-layer upstream write attempt returned GitHub `403 Resource not accessible by integration`; the artifact is therefore complete and ready for a closer with ordinary GitHub comment permission.