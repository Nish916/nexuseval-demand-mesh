# Sources

Pinned repository state used for this package:  
https://github.com/Scottcjn/rustchain-bounties/tree/5f345f665434b743c65ec502026097b39724ddd8

## Claim map

### Claim: a successful payout response may be in a `pending` phase
Source: `scripts/bounty_payout.py`, payout-result handling.  
https://github.com/Scottcjn/rustchain-bounties/blob/5f345f665434b743c65ec502026097b39724ddd8/scripts/bounty_payout.py#L560-L575

### Claim: the code calls a pending payout “queued,” not “sent”
Source: comments and the `phase == "pending"` branch explicitly distinguish queued from settled.  
https://github.com/Scottcjn/rustchain-bounties/blob/5f345f665434b743c65ec502026097b39724ddd8/scripts/bounty_payout.py#L560-L575

### Claim: balance movement waits for the pending confirmer
Source: source comment immediately above the pending-state wording.  
https://github.com/Scottcjn/rustchain-bounties/blob/5f345f665434b743c65ec502026097b39724ddd8/scripts/bounty_payout.py#L563-L566

### Claim: the displayed confirmation window defaults to 24 hours if the node does not provide another value
Source: `hrs=resp.get("confirms_in_hours",24)`.  
https://github.com/Scottcjn/rustchain-bounties/blob/5f345f665434b743c65ec502026097b39724ddd8/scripts/bounty_payout.py#L570-L573

### Claim: the payout message records transaction identity when available
Source: `tx_hash` is read and included in the state text.  
https://github.com/Scottcjn/rustchain-bounties/blob/5f345f665434b743c65ec502026097b39724ddd8/scripts/bounty_payout.py#L567-L575

## Editorial limits
This kit does **not** claim:
- that pending RTC has settled,
- a market value for RTC,
- an off-ramp,
- guaranteed earnings,
- or that every pending transfer always confirms after exactly 24 hours.
