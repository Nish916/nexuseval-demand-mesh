from __future__ import annotations

import io
import json
import unittest
from unittest.mock import patch

from client import AgentEconomyClient, AgentEconomyError, UnsafeMutationError


class FakeResponse:
    def __init__(self, payload):
        self.payload = json.dumps(payload).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self):
        return self.payload


class AgentEconomyClientTests(unittest.TestCase):
    def setUp(self):
        self.client = AgentEconomyClient(base_url="https://node.example")

    @patch("client.urlopen")
    def test_list_jobs_is_get_and_preserves_filters(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse({"jobs": [], "count": 0})
        result = self.client.list_jobs(
            status="open", category="code", min_reward=5, limit=10, offset=3
        )
        self.assertEqual(result["count"], 0)
        req = mock_urlopen.call_args.args[0]
        self.assertEqual(req.get_method(), "GET")
        self.assertIn("/agent/jobs?", req.full_url)
        self.assertIn("status=open", req.full_url)
        self.assertIn("category=code", req.full_url)
        self.assertIn("min_reward=5", req.full_url)
        self.assertIn("limit=10", req.full_url)
        self.assertIn("offset=3", req.full_url)

    @patch("client.urlopen")
    def test_get_job_url_quotes_identifier(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse({"job_id": "job one"})
        self.client.get_job("job one")
        req = mock_urlopen.call_args.args[0]
        self.assertTrue(req.full_url.endswith("/agent/jobs/job%20one"))

    @patch("client.urlopen")
    def test_reputation_is_read_only(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse({"wallet_id": "RTCabc"})
        self.client.reputation("RTCabc")
        req = mock_urlopen.call_args.args[0]
        self.assertEqual(req.get_method(), "GET")
        self.assertTrue(req.full_url.endswith("/agent/reputation/RTCabc"))

    def test_mutations_fail_closed_by_default(self):
        with self.assertRaisesRegex(UnsafeMutationError, "mutation blocked"):
            self.client.claim_job("job_123", "RTCworker")
        with self.assertRaises(UnsafeMutationError):
            self.client.post_job(
                poster_wallet="RTCposter",
                title="A useful job",
                description="A sufficiently long description for a real task.",
                reward_rtc=5,
            )
        with self.assertRaises(UnsafeMutationError):
            self.client.deliver_job(
                "job_123", worker_wallet="RTCworker", result_summary="done"
            )

    @patch("client.urlopen")
    def test_legacy_mutation_requires_explicit_opt_in(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse({"ok": True, "status": "claimed"})
        client = AgentEconomyClient(
            base_url="https://trusted-local.example",
            allow_legacy_unsigned_mutations=True,
        )
        result = client.claim_job("job_123", "RTCworker")
        self.assertTrue(result["ok"])
        req = mock_urlopen.call_args.args[0]
        self.assertEqual(req.get_method(), "POST")
        self.assertTrue(req.full_url.endswith("/agent/jobs/job_123/claim"))
        self.assertEqual(json.loads(req.data), {"worker_wallet": "RTCworker"})

    def test_rejects_invalid_pagination(self):
        with self.assertRaises(ValueError):
            self.client.list_jobs(limit=0)
        with self.assertRaises(ValueError):
            self.client.list_jobs(limit=101)
        with self.assertRaises(ValueError):
            self.client.list_jobs(offset=-1)

    @patch("client.urlopen")
    def test_non_object_json_fails(self, mock_urlopen):
        class ListResponse(FakeResponse):
            def __init__(self):
                self.payload = b"[]"

        mock_urlopen.return_value = ListResponse()
        with self.assertRaisesRegex(AgentEconomyError, "must be a JSON object"):
            self.client.stats()


if __name__ == "__main__":
    unittest.main()
