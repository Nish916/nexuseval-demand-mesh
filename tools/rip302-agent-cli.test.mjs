import test from "node:test";
import assert from "node:assert/strict";
import { endpoint, normalizeBase } from "./rip302-agent-cli.mjs";

test("normalizeBase removes trailing slashes", () => {
  assert.equal(normalizeBase("https://rustchain.org///"), "https://rustchain.org");
});

test("endpoint joins API paths safely", () => {
  assert.equal(endpoint("https://rustchain.org/", "/agent/jobs"), "https://rustchain.org/agent/jobs");
  assert.equal(endpoint("https://rustchain.org", "agent/stats"), "https://rustchain.org/agent/stats");
});

test("job identifiers can be URL encoded by caller path construction", () => {
  const jobId = encodeURIComponent("job/with spaces");
  assert.equal(endpoint("https://rustchain.org", `/agent/jobs/${jobId}`), "https://rustchain.org/agent/jobs/job%2Fwith%20spaces");
});
