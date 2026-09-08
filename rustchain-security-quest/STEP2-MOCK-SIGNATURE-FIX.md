# RustChain Security Quest #398 — Step 2

Claimant: Nishant Sinha / @Nish916  
RTC wallet: `RTCbc589ef246bc1c5c8c44117f1d66b226f33b9f73`

## Known vulnerability reproduced by code reading: Mock Signature Mode

This write-up covers the already-fixed **Mock Signature Mode** item listed in Step 2 of rustchain-bounties #398. It does not attack production or attempt to bypass the live network. The goal is to show the pre-fix failure mode, identify the present guard, and explain why the current design materially closes the specific issue.

## 1. What the attack looked like before the fix

Older RustChain node/miner code contained explicit test-mode compatibility for non-cryptographic signatures. Historical node code derived `TESTNET_ALLOW_MOCK_SIG` from an environment variable and the older miner code generated a `mock_signature` payload. This is useful during isolated testing, but dangerous if such a mode can accidentally be enabled in a real node: the security property changes from “the sender proves possession of the Ed25519 private key” to “the server accepts a test representation that is not a real Ed25519 signature.”

The failure is therefore configuration-to-consensus confusion. If production startup permits the test flag, a request path that relies on that flag can accept an attestation/header without the normal cryptographic proof. The attacker does not need to break Ed25519; they only need the node to run with the insecure compatibility path enabled.

The related inline-public-key test mode compounds the same class of risk. Historical verification flow allowed the request body’s `pubkey` when `TESTNET_ALLOW_INLINE_PUBKEY` was enabled, instead of requiring the registered miner key. A test client could therefore supply both the key material and a mock/test signature path. That is appropriate only in a controlled test runtime and must never be silently reachable in production.

## 2. The current fix

The current repository has a dedicated `node/ed25519_config.py` that hard-disables both dangerous compatibility flags by default:

- `TESTNET_ALLOW_INLINE_PUBKEY = False`
- `TESTNET_ALLOW_MOCK_SIG = False`

The comments explicitly mark inline public keys as bypassing the key registry and mock signatures as insecure.

More importantly, the fix is not only a default value. `node/tests/test_mock_signature_guard.py` verifies a **fail-closed runtime guard**. When `TESTNET_ALLOW_MOCK_SIG` is forced to `True` while `RC_RUNTIME_ENV=production`, `enforce_mock_signature_runtime_guard()` must raise `RuntimeError`. The same test suite verifies that test runtime can intentionally allow the flag, preserving testability without making production depend on an operator remembering to disable it.

The WSGI startup path is covered too: the regression test builds a stub node whose guard raises and asserts that `node/wsgi.py` invokes the guard before database initialization. This matters because a secure helper function is not sufficient if the production entrypoint never calls it.

The repository’s current testnet deployment script also deliberately leaves mock-signature and inline-pubkey modes off while describing the testnet as mirroring mainnet consensus with real Ed25519 signatures and real fingerprint gating.

## 3. Why the fix is sufficient for this specific vulnerability

The original weakness was not a cryptographic break; it was an **unsafe test-mode activation path**. The current design addresses that at three layers:

1. **Secure default:** both compatibility flags are false in the central configuration.
2. **Runtime environment separation:** even if code or configuration changes `TESTNET_ALLOW_MOCK_SIG=True`, production startup fails closed rather than serving traffic in the insecure mode.
3. **Entrypoint enforcement + regression tests:** WSGI invokes the guard before normal initialization, and tests assert that ordering.

That converts an easy-to-misconfigure security downgrade into an explicit startup failure. An operator cannot accidentally boot a production WSGI node with mock signatures enabled and simply receive a warning.

## 4. Residual recommendation

The same fail-closed treatment should remain symmetric for every consensus-affecting test switch, especially inline public keys. Test-only switches should be centralized, default false, environment-gated, checked at every production entrypoint, and covered by regression tests. The current mock-signature guard is a strong pattern because it treats insecure production configuration as fatal rather than advisory.

## Source map

- Historical mock/inline compatibility behavior: `deprecated/old_nodes/rustchain_v2_active.py`
- Historical miner mock signature + inline key payload: `deprecated/old_miners/rustchain_g4_miner_fixed.py` and `miners/ppc/rustchain_powerpc_g4_miner_v2.2.2.py`
- Current secure defaults: `node/ed25519_config.py`
- Current fail-closed regression coverage: `node/tests/test_mock_signature_guard.py`
- Production WSGI guard invocation: `node/wsgi.py`
- Current testnet policy: `testnet/deploy_testnet.sh`

Conclusion: the known Mock Signature Mode vulnerability is addressed by disabling the compatibility mode by default and, critically, refusing production startup if the insecure flag is enabled.