# Script — “Accepted Is Not Settled”

**Target runtime:** ~50–55 seconds  
**Format:** 9:16 vertical

**0–4s — Hook**  
“Your RustChain bounty says payout accepted. Does that mean the balance already moved? Not necessarily.”

**4–14s**  
“In the current payout runner, a successful transfer can come back with phase set to ‘pending’.”

**14–25s**  
“When that happens, the code deliberately calls the payout ‘queued’ — not ‘sent’ — because the balance moves only after the confirmation window clears.”

**25–36s**  
“The default wording says that window is about twenty-four hours, unless the node reports a different confirmation time.”

**36–46s**  
“So there are separate states: work can be accepted, a transfer can be queued, and settlement can still be pending.”

**46–55s — Close**  
“If you automate bounty accounting, record the phase and transaction identity. Don’t turn ‘request accepted’ into ‘cash confirmed.’ Source: RustChain’s public payout code.”

**Disclosure:** This package was prepared with AI assistance and checked against the cited public source.
