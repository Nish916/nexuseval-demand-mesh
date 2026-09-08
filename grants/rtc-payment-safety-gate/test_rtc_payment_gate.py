import unittest
from decimal import Decimal

from rtc_payment_gate import (
    GateError,
    PaymentPolicy,
    PaymentQuote,
    SettlementReceipt,
    retry_decision,
    validate_quote,
    validate_receipt,
)


NOW = 2_000_000_000
REQUEST_HASH = "sha256:real-task-v1"
RECIPIENT = "RTCbc589ef246bc1c5c8c44117f1d66b226f33b9f73"


def policy() -> PaymentPolicy:
    return PaymentPolicy(
        max_amount=Decimal("1.00"),
        allowed_networks=frozenset({"rustchain-mainnet"}),
        allowed_assets=frozenset({"RTC"}),
        allowed_recipients=frozenset({RECIPIENT}),
        max_quote_ttl_seconds=900,
    )


def quote(**changes) -> PaymentQuote:
    data = dict(
        quote_id="quote-1",
        scheme="rtc-x402",
        network="rustchain-mainnet",
        asset="RTC",
        pay_to=RECIPIENT,
        amount=Decimal("0.10"),
        request_hash=REQUEST_HASH,
        expires_at=NOW + 300,
    )
    data.update(changes)
    return PaymentQuote(**data)


def receipt(**changes) -> SettlementReceipt:
    data = dict(
        quote_id="quote-1",
        network="rustchain-mainnet",
        asset="RTC",
        pay_to=RECIPIENT,
        amount=Decimal("0.10"),
        request_hash=REQUEST_HASH,
        status="settled",
        tx_id="tx-abc",
    )
    data.update(changes)
    return SettlementReceipt(**data)


class QuoteValidationTests(unittest.TestCase):
    def test_valid_quote_can_reach_signer(self):
        result = validate_quote(quote(), policy(), expected_request_hash=REQUEST_HASH, now=NOW)
        self.assertEqual(result["decision"], "ALLOW_TO_SIGN")

    def test_recipient_drift_fails_closed(self):
        with self.assertRaisesRegex(GateError, "recipient"):
            validate_quote(
                quote(pay_to="RTC0000000000000000000000000000000000000000"),
                policy(),
                expected_request_hash=REQUEST_HASH,
                now=NOW,
            )

    def test_amount_increase_fails_closed(self):
        with self.assertRaisesRegex(GateError, "amount"):
            validate_quote(
                quote(amount=Decimal("1.01")), policy(), expected_request_hash=REQUEST_HASH, now=NOW
            )

    def test_request_hash_mismatch_fails_closed(self):
        with self.assertRaisesRegex(GateError, "different request"):
            validate_quote(quote(), policy(), expected_request_hash="sha256:other", now=NOW)

    def test_expired_quote_fails_closed(self):
        with self.assertRaisesRegex(GateError, "expired"):
            validate_quote(
                quote(expires_at=NOW - 1), policy(), expected_request_hash=REQUEST_HASH, now=NOW
            )

    def test_excessive_ttl_fails_closed(self):
        with self.assertRaisesRegex(GateError, "TTL"):
            validate_quote(
                quote(expires_at=NOW + 901), policy(), expected_request_hash=REQUEST_HASH, now=NOW
            )


class ReceiptValidationTests(unittest.TestCase):
    def test_matching_settlement_is_accepted(self):
        result = validate_receipt(receipt(), quote())
        self.assertEqual(result["decision"], "SETTLED")

    def test_amount_mismatch_is_not_called_settled(self):
        with self.assertRaisesRegex(GateError, "amount mismatch"):
            validate_receipt(receipt(amount=Decimal("0.09")), quote())

    def test_pending_receipt_is_not_called_settled(self):
        with self.assertRaisesRegex(GateError, "not settled"):
            validate_receipt(receipt(status="pending", tx_id=""), quote())


class RetrySafetyTests(unittest.TestCase):
    def test_retry_stops_after_settlement(self):
        q = quote()
        result = retry_decision(
            approved_quote_fingerprint=q.fingerprint(), retry_quote=q, known_receipts=[receipt()]
        )
        self.assertEqual(result["decision"], "STOP")

    def test_retry_stops_on_ambiguous_receipt(self):
        q = quote()
        result = retry_decision(
            approved_quote_fingerprint=q.fingerprint(),
            retry_quote=q,
            known_receipts=[receipt(status="pending", tx_id="")],
        )
        self.assertEqual(result["decision"], "STOP")
        self.assertIn("ambiguous", result["reason"])

    def test_retry_stops_if_quote_changes(self):
        q = quote()
        changed = quote(amount=Decimal("0.11"))
        result = retry_decision(
            approved_quote_fingerprint=q.fingerprint(), retry_quote=changed, known_receipts=[]
        )
        self.assertEqual(result["decision"], "STOP")

    def test_retry_allowed_only_with_unchanged_quote_and_no_receipt(self):
        q = quote()
        result = retry_decision(
            approved_quote_fingerprint=q.fingerprint(), retry_quote=q, known_receipts=[]
        )
        self.assertEqual(result["decision"], "RETRY_ALLOWED")


if __name__ == "__main__":
    unittest.main()
