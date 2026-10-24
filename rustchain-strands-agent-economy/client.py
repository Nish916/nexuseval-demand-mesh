from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen


DEFAULT_NODE = "https://rustchain.org"


class AgentEconomyError(RuntimeError):
    """Raised when the RIP-302 API cannot be safely used."""


class UnsafeMutationError(AgentEconomyError):
    """Raised when a legacy unsigned state-changing call is attempted by default."""


@dataclass
class AgentEconomyClient:
    """Small RIP-302 client designed for agent-framework tools.

    Public GET operations are enabled by default. Current upstream RIP-302
    mutation routes identify actors with JSON wallet strings and do not provide
    cryptographic caller authentication in the reviewed implementation. For that
    reason mutation methods are fail-closed unless the caller explicitly opts
    into legacy unsigned mutations.
    """

    base_url: str = DEFAULT_NODE
    timeout: float = 12.0
    allow_legacy_unsigned_mutations: bool = False

    def __post_init__(self) -> None:
        self.base_url = self.base_url.rstrip("/")
        if self.timeout <= 0:
            raise ValueError("timeout must be positive")

    def _request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        body = None
        headers = {"Accept": "application/json", "User-Agent": "nexuseval-strands-rip302/1.0"}
        if payload is not None:
            body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
            headers["Content-Type"] = "application/json"
        req = Request(f"{self.base_url}{path}", data=body, headers=headers, method=method)
        try:
            with urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read().decode("utf-8")
        except HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:1000]
            raise AgentEconomyError(f"HTTP {exc.code} for {path}: {detail}") from exc
        except (URLError, TimeoutError, OSError) as exc:
            raise AgentEconomyError(f"network error for {path}: {exc}") from exc

        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise AgentEconomyError(f"non-JSON response for {path}") from exc
        if not isinstance(data, dict):
            raise AgentEconomyError(f"node response for {path} must be a JSON object")
        return data

    def _require_mutation_opt_in(self) -> None:
        if not self.allow_legacy_unsigned_mutations:
            raise UnsafeMutationError(
                "RIP-302 mutation blocked: reviewed upstream routes trust wallet-name fields "
                "without cryptographic caller authentication. Set "
                "allow_legacy_unsigned_mutations=True only for a trusted/local deployment "
                "or after upstream authenticated mutations are available."
            )

    # Safe public discovery -------------------------------------------------
    def list_jobs(
        self,
        *,
        status: str = "open",
        category: str | None = None,
        min_reward: float | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict[str, Any]:
        if limit < 1 or limit > 100:
            raise ValueError("limit must be between 1 and 100")
        if offset < 0:
            raise ValueError("offset must be non-negative")
        params: dict[str, Any] = {"status": status, "limit": limit, "offset": offset}
        if category:
            params["category"] = category
        if min_reward is not None:
            if min_reward < 0:
                raise ValueError("min_reward must be non-negative")
            params["min_reward"] = min_reward
        return self._request("GET", f"/agent/jobs?{urlencode(params)}")

    def get_job(self, job_id: str) -> dict[str, Any]:
        job_id = job_id.strip()
        if not job_id:
            raise ValueError("job_id is required")
        return self._request("GET", f"/agent/jobs/{quote(job_id, safe='')}")

    def reputation(self, wallet_id: str) -> dict[str, Any]:
        wallet_id = wallet_id.strip()
        if not wallet_id:
            raise ValueError("wallet_id is required")
        return self._request("GET", f"/agent/reputation/{quote(wallet_id, safe='')}")

    def stats(self) -> dict[str, Any]:
        return self._request("GET", "/agent/stats")

    # Explicitly gated legacy mutation wrappers ----------------------------
    def post_job(
        self,
        *,
        poster_wallet: str,
        title: str,
        description: str,
        reward_rtc: float,
        category: str = "other",
        ttl_seconds: int = 7 * 86400,
        tags: list[str] | None = None,
    ) -> dict[str, Any]:
        self._require_mutation_opt_in()
        return self._request(
            "POST",
            "/agent/jobs",
            {
                "poster_wallet": poster_wallet,
                "title": title,
                "description": description,
                "reward_rtc": reward_rtc,
                "category": category,
                "ttl_seconds": ttl_seconds,
                "tags": tags or [],
            },
        )

    def claim_job(self, job_id: str, worker_wallet: str) -> dict[str, Any]:
        self._require_mutation_opt_in()
        return self._request(
            "POST",
            f"/agent/jobs/{quote(job_id, safe='')}/claim",
            {"worker_wallet": worker_wallet},
        )

    def deliver_job(
        self,
        job_id: str,
        *,
        worker_wallet: str,
        deliverable_url: str = "",
        result_summary: str = "",
        deliverable_hash: str = "",
    ) -> dict[str, Any]:
        self._require_mutation_opt_in()
        return self._request(
            "POST",
            f"/agent/jobs/{quote(job_id, safe='')}/deliver",
            {
                "worker_wallet": worker_wallet,
                "deliverable_url": deliverable_url,
                "deliverable_hash": deliverable_hash,
                "result_summary": result_summary,
            },
        )
