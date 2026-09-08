from __future__ import annotations

import argparse
import hashlib
import json
import time
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Iterable


class GateError(ValueError):
    """Raised when a quote or receipt fails fail-closed validation."""


def _decimal(value: Any) -> Decimal:
    try:
        amount = Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError) as exc:
        raise GateError("amount is not a valid decimal") from exc
    if not amount.is_finite() or amount <= 0:
        raise GateError("amount must be finite and greater than zero")
    return amount


def _required_str(data: dict[str, Any], key: str) -> str:
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        raise GateError(f"{key} must be a non-empty string")
    return value.strip()


@dataclass(frozen=True)
class PaymentPolicy:
    max_amount: Decimal
    allowed_networks: frozenset[str]
    allowed_assets: frozenset[str]
    allowed_recipients: frozenset[str]
    require_request_hash: bool = True
    max_quote_ttl_seconds: int = 900

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "PaymentPolicy":
        return cls(
            max_amount=_decimal(data["max_amount"]),
            allowed_networks=frozenset(map(str, data.get("allowed_networks", []))),
            allowed_assets=frozenset(map(str, data.get("allowed_assets", []))),
            allowed_recipients=frozenset(map(str, data.get("allowed_recipients", []))),
            require_request_hash=bool(data.get("require_request_hash", True)),
            max_quote_ttl_seconds=int(data.get("max_quote_ttl_seconds", 900)),
        )


@dataclass(frozen=True)
class PaymentQuote:
    quote_id: str
    scheme: str
    network: str
    asset: str
    pay_to: str
    amount: Decimal
    request_hash: str
    expires_at: int

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "PaymentQuote":
        return cls(
            quote_id=_required_str(data, "quote_id"),
            scheme=_required_str(data, "scheme"),
            network=_required_str(data, "network"),
            asset=_required_str(data, "asset"),
            pay_to=_required_str(data, "pay_to"),
            amount=_decimal(data.get("amount")),
            request_hash=str(data.get("request_hash", "")).strip(),
            expires_at=int(data.get("expires_at", 0)),
        )

    def fingerprint(self) -> str:
        canonical = json.dumps(
            {
                "quote_id": self.quote_id,
                "scheme": self.scheme,
                "network": self.network,
                "asset": self.asset,
                "pay_to": self.pay_to,
                "amount": format(self.amount, "f"),
                "request_hash": self.request_hash,
                "expires_at": self.expires_at,
            },
            sort_keys=True,
            separators=(",", ":"),
        )
        return hashlib.sha256(canonical.encode()).hexdigest()


@dataclass(frozen=True)
class SettlementReceipt:
    quote_id: str
    network: str
    asset: str
    pay_to: str
    amount: Decimal
    request_hash: str
    status: str
    tx_id: str

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "SettlementReceipt":
        return cls(
            quote_id=_required_str(data, "quote_id"),
            network=_required_str(data, "network"),
            asset=_required_str(data, "asset"),
            pay_to=_required_str(data, "pay_to"),
            amount=_decimal(data.get("amount")),
            request_hash=str(data.get("request_hash", "")).strip(),
            status=_required_str(data, "status").lower(),
            tx_id=str(data.get("tx_id", "")).strip(),
        )


def validate_quote(
    quote: PaymentQuote,
    policy: PaymentPolicy,
    *,
    expected_request_hash: str,
    now: int | None = None,
) -> dict[str, Any]:
    """Fail closed before any signer/wallet is invoked."""
    now = int(time.time()) if now is None else int(now)
    errors: list[str] = []

    if quote.scheme not in {"x402", "rtc-x402"}:
        errors.append("unsupported payment scheme")
    if quote.network not in policy.allowed_networks:
        errors.append("network is not allowed")
    if quote.asset not in policy.allowed_assets:
        errors.append("asset is not allowed")
    if quote.pay_to not in policy.allowed_recipients:
        errors.append("recipient drift or unapproved recipient")
    if quote.amount > policy.max_amount:
        errors.append("amount exceeds policy maximum")
    if quote.expires_at <= now:
        errors.append("quote is expired")
    if quote.expires_at - now > policy.max_quote_ttl_seconds:
        errors.append("quote TTL exceeds policy maximum")
    if policy.require_request_hash:
        if not quote.request_hash:
            errors.append("request hash is required")
        elif quote.request_hash != expected_request_hash:
            errors.append("quote is bound to a different request")

    if errors:
        raise GateError("; ".join(errors))

    return {
        "decision": "ALLOW_TO_SIGN",
        "quote_id": quote.quote_id,
        "quote_fingerprint": quote.fingerprint(),
        "amount": format(quote.amount, "f"),
        "recipient": quote.pay_to,
        "network": quote.network,
        "asset": quote.asset,
    }


def validate_receipt(receipt: SettlementReceipt, quote: PaymentQuote) -> dict[str, Any]:
    """Verify that a post-payment receipt settles exactly the approved quote."""
    mismatches: list[str] = []
    if receipt.quote_id != quote.quote_id:
        mismatches.append("quote_id mismatch")
    if receipt.network != quote.network:
        mismatches.append("network mismatch")
    if receipt.asset != quote.asset:
        mismatches.append("asset mismatch")
    if receipt.pay_to != quote.pay_to:
        mismatches.append("recipient mismatch")
    if receipt.amount != quote.amount:
        mismatches.append("amount mismatch")
    if receipt.request_hash != quote.request_hash:
        mismatches.append("request hash mismatch")
    if receipt.status not in {"settled", "confirmed"}:
        mismatches.append("receipt is not settled")
    if not receipt.tx_id:
        mismatches.append("settled receipt has no transaction id")

    if mismatches:
        raise GateError("; ".join(mismatches))

    return {
        "decision": "SETTLED",
        "quote_id": quote.quote_id,
        "quote_fingerprint": quote.fingerprint(),
        "tx_id": receipt.tx_id,
    }


def retry_decision(
    *,
    approved_quote_fingerprint: str,
    retry_quote: PaymentQuote,
    known_receipts: Iterable[SettlementReceipt],
) -> dict[str, str]:
    """Prevent ambiguous double-spend retries.

    A retry is allowed only when the quote is byte-semantically unchanged and
    there is no settled/confirmed receipt for it. Any ambiguous/non-final
    receipt causes a STOP so a human or authoritative settlement lookup can
    resolve state before another payment is attempted.
    """
    if retry_quote.fingerprint() != approved_quote_fingerprint:
        return {"decision": "STOP", "reason": "quote changed before retry"}

    matching = [r for r in known_receipts if r.quote_id == retry_quote.quote_id]
    if any(r.status in {"settled", "confirmed"} for r in matching):
        return {"decision": "STOP", "reason": "matching payment already settled"}
    if matching:
        return {"decision": "STOP", "reason": "payment state is ambiguous; verify settlement first"}
    return {"decision": "RETRY_ALLOWED", "reason": "no receipt observed and quote is unchanged"}


def _load(path: str) -> dict[str, Any]:
    return json.loads(Path(path).read_text())


def main() -> int:
    parser = argparse.ArgumentParser(description="Fail-closed preflight for RTC/x402 agent payments")
    sub = parser.add_subparsers(dest="command", required=True)

    preflight = sub.add_parser("preflight")
    preflight.add_argument("quote")
    preflight.add_argument("policy")
    preflight.add_argument("--request-hash", required=True)
    preflight.add_argument("--now", type=int)

    receipt = sub.add_parser("receipt")
    receipt.add_argument("quote")
    receipt.add_argument("receipt")

    args = parser.parse_args()
    try:
        if args.command == "preflight":
            result = validate_quote(
                PaymentQuote.from_dict(_load(args.quote)),
                PaymentPolicy.from_dict(_load(args.policy)),
                expected_request_hash=args.request_hash,
                now=args.now,
            )
        else:
            result = validate_receipt(
                SettlementReceipt.from_dict(_load(args.receipt)),
                PaymentQuote.from_dict(_load(args.quote)),
            )
    except (GateError, KeyError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"ok": False, "decision": "STOP", "error": str(exc)}))
        return 2

    print(json.dumps({"ok": True, **result}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
