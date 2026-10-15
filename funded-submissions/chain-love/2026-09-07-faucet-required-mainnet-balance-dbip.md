# Chain.Love DBIP submission packet

## Target
- Program: Chain.Love database population bounty program, Discussion #41
- Reward path: 10 USDC for an approved DBIP; current program says monthly Ethereum-mainnet USDC/USDT payouts to the public ERC-20 address supplied in the issue.
- Intended rewards address: `0xeD7E99F4a81CbaEeFe1B8eceDeBCdA812aa15C73`
- Upstream submission attempted 2026-09-07 through the connected GitHub App and rejected with HTTP 403 `Resource not accessible by integration`.

## Exact upstream issue title

`[DBIP] Make faucet requiredMainnetBalance machine-readable without losing network-specific eligibility`

## Exact upstream issue body

### Proposal type

Modify column

### Affected scope (files/folders/chains)

- `references/offers/faucets.csv`
- `listings/all-networks/faucets.csv`
- `listings/specific-networks/*/faucets.csv`
- faucet schema / generated metadata
- Faucets wiki documentation

### Motivation / problem statement

`requiredMainnetBalance` is currently a free-form scalar even though it represents structured eligibility data that consumers need to compare numerically and by asset/network.

Current canonical values already mix several incompatible forms, for example:

- Alchemy: `0.001 ETH`
- Chainlink: `1 LINK`
- Chainstack: `0.08 ETH`
- GetBlock: `0.005 ETH`
- Tatum: `0.001 native mainnet token`

Network-specific listings make the ambiguity more visible. For example, the current Solana faucet listing stores:

- Chainstack: `0.08 SOL`
- QuickNode: `0.05 SOL`

So a consumer cannot safely sort/filter by minimum balance, determine the relevant asset, or distinguish an exact numeric requirement from a provider-relative phrase without reparsing arbitrary text.

The provider rules are genuinely network-sensitive. Current first-party documentation shows:

- Alchemy requires at least `0.001 ETH` on Ethereum Mainnet for EVM-based testnets and an equivalent minimum balance on the corresponding chain mainnet for non-EVM networks.
- Chainstack's live Solana devnet faucet requires a minimum `0.8 SOL` on Solana mainnet.
- Chainstack's EVM faucet pages currently require `0.08 ETH` on Ethereum mainnet.

This makes the present string representation particularly risky for agents and downstream applications: `0.08 ETH`, `0.8 SOL`, and `0.001 native mainnet token` are all eligibility thresholds, but they cannot be compared or validated mechanically.

This proposal does **not** duplicate #2547. That DBIP explicitly excludes minimum-mainnet-balance requirements from its proposed `claimRequirements` array and leaves `requiredMainnetBalance` authoritative. This proposal improves that existing field itself.

### Detailed proposal

#### Column change

- Category/table: `faucets`
- Column name: `requiredMainnetBalance`
- Change type: modify
- Updated definition: structured minimum mainnet balance required for a normal faucet claim, including the amount, asset, and mainnet on which the balance is measured.

#### Proposed value type

Use a nullable JSON object:

```json
{
  "amount": "0.001",
  "asset": "ETH",
  "mainnet": "ethereum"
}
```

All three properties are strings so decimal precision is preserved exactly and no floating-point conversion is required.

Examples:

Alchemy EVM faucet:

```json
{"amount":"0.001","asset":"ETH","mainnet":"ethereum"}
```

Chainstack Solana faucet:

```json
{"amount":"0.8","asset":"SOL","mainnet":"solana"}
```

Chainstack EVM faucet:

```json
{"amount":"0.08","asset":"ETH","mainnet":"ethereum"}
```

If a provider documents only a relative requirement such as “equivalent minimum balance on the corresponding mainnet” and no exact value can be verified for a particular listing, leave the structured value blank rather than encoding prose as a fake numeric threshold. The human-readable condition can remain in `additionalNotes` until a primary-source value is available.

### Normalization / validation rules

1. `amount` must be a positive decimal string; reject units, comparison symbols, scientific notation, and prose inside the amount.
2. `asset` must be a non-empty canonical asset symbol from the supporting primary source.
3. `mainnet` must identify the network on which eligibility is evaluated, using the repository's canonical network slug where one exists.
4. A listing may override the canonical offer value when the provider's eligibility threshold varies by network.
5. Blank/NULL means no verified minimum balance requirement is available; do not use `0` to mean unknown.
6. Do not infer a threshold from the faucet's drip token. The mainnet eligibility asset may differ from the testnet token being dispensed.
7. Every migration from an existing free-form value must preserve meaning and be backed by an official provider source.
8. Relative/provider-generic phrases such as `native mainnet token` should not be migrated to a fabricated asset or amount. Resolve them per listing from primary documentation or leave blank with the prose preserved in notes.

### Migration plan

1. Add schema support for the structured object while temporarily accepting the current string form so unrelated PRs do not break.
2. Update faucet metadata/wiki examples and document the network-specific override rule.
3. Migrate a small verified batch first (for example Alchemy EVM, Chainstack EVM, and Chainstack Solana) and confirm generated output.
4. Backfill remaining faucet rows incrementally from primary sources.
5. After the compatibility window and full migration, reject free-form strings for `requiredMainnetBalance`.

### Acceptance criteria

- [ ] Faucet schema accepts the structured `{amount, asset, mainnet}` object and validates each field.
- [ ] Invalid amounts and incomplete objects fail validation.
- [ ] Canonical offer values can be overridden by network-specific listings without changing unrelated inherited faucet fields.
- [ ] A source-backed migration demonstrates at least one EVM threshold and one non-EVM threshold.
- [ ] Generated JSON preserves decimal values exactly as strings.
- [ ] No provider-relative prose is silently converted into guessed numeric data.
- [ ] Faucet documentation explains NULL vs. verified structured thresholds and the override rule.
- [ ] Existing generation/validation checks pass during the compatibility phase.

### Evidence

Current repository data:
- `references/offers/faucets.csv` contains free-form values including `0.001 ETH`, `1 LINK`, `0.08 ETH`, `0.005 ETH`, and `0.001 native mainnet token`.
- `listings/specific-networks/solana/faucets.csv` already contains network overrides such as `0.08 SOL` and `0.05 SOL`.

Primary provider evidence checked on 2026-09-07:
- Alchemy faucets: https://www.alchemy.com/faucets
- Chainstack Solana faucet: https://faucet.chainstack.com/solana-devnet-faucet
- Chainstack EVM faucet: https://faucet.chainstack.com/sepolia-testnet-faucet

### Relationship to existing proposals

- #2547 normalizes *additional* faucet claim requirements and explicitly keeps minimum mainnet balance in `requiredMainnetBalance`; this proposal modifies that existing field.
- #3300 concerns incorrect wiki example column alignment; it does not address the value model.

### AI disclosure

AI assistance was used to inspect the current repository values, search for duplicates, verify primary provider documentation, and draft this proposal. No faucet was claimed, no wallet was signed, and no provider credential was used.

### Rewards address

`0xeD7E99F4a81CbaEeFe1B8eceDeBCdA812aa15C73` (ERC-20 address; Chain.Love currently documents Ethereum-mainnet USDC/USDT payouts)

## Closer submission instructions

1. Open `https://github.com/Chain-Love/chain-love/issues/new` while authenticated to a GitHub account that can create issues in the public repository.
2. Paste the exact title and exact body above unchanged.
3. Do not add claims of approval, acceptance, payout, or earnings.
4. Preserve the rewards address exactly as written.
5. After issue creation, record the upstream issue URL and hand it to the verifier/closer stage.

## Verification checklist

- [x] Program publicly advertises 10 USDC for an approved DBIP.
- [x] Program has public historical reward/payment summaries and maintainer confirmation of past DBIP payment.
- [x] No worker spend, deposit, stake, bid, private key, wallet signature, KYC, or new legal acceptance is needed to file the DBIP.
- [x] Current repository source inspected.
- [x] Duplicate searches performed for `requiredMainnetBalance`, `mainnet balance`, and related faucet DBIPs.
- [x] #2547 and #3300 reviewed and explicitly differentiated.
- [x] Primary provider evidence checked for Alchemy and Chainstack.
- [x] Upstream GitHub creation attempted; 403 integration-permission blocker recorded.
- [ ] Upstream issue creation completed by closer with writable GitHub identity.
- [ ] Maintainer approval received.
- [ ] Authoritative settlement received.
