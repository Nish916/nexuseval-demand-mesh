#!/usr/bin/env node

/**
 * Dependency-free CLI for RustChain RIP-302 Agent Economy.
 *
 * Read-only commands are safe by default. Mutating commands require the
 * operator to pass the worker wallet explicitly and print the exact action
 * before sending it. This tool never stores keys or signs transfers.
 */

const DEFAULT_BASE = process.env.RUSTCHAIN_AGENT_BASE || "https://rustchain.org";

function usage() {
  console.log(`RustChain RIP-302 Agent Economy CLI

Usage:
  node tools/rip302-agent-cli.mjs jobs [limit]
  node tools/rip302-agent-cli.mjs job <job_id>
  node tools/rip302-agent-cli.mjs stats
  node tools/rip302-agent-cli.mjs reputation <wallet>
  node tools/rip302-agent-cli.mjs claim <job_id> <worker_wallet>
  node tools/rip302-agent-cli.mjs deliver <job_id> <worker_wallet> <deliverable_url> <summary...>

Environment:
  RUSTCHAIN_AGENT_BASE   API base URL (default: ${DEFAULT_BASE})

Safety:
  - No private key or seed is read or stored.
  - This CLI does not post jobs or lock escrow.
  - claim/deliver operate only on an already-existing job and explicit wallet.
`);
}

export function normalizeBase(base = DEFAULT_BASE) {
  return String(base).replace(/\/+$/, "");
}

export function endpoint(base, path) {
  return `${normalizeBase(base)}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} from ${url}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function render(data) {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export async function run(argv = process.argv.slice(2), base = DEFAULT_BASE) {
  const [command, ...args] = argv;

  if (!command || ["-h", "--help", "help"].includes(command)) {
    usage();
    return 0;
  }

  if (command === "jobs") {
    const limit = Number(args[0] || 20);
    const data = await requestJson(endpoint(base, "/agent/jobs"));
    if (Array.isArray(data)) render(data.slice(0, Number.isFinite(limit) ? limit : 20));
    else if (Array.isArray(data?.jobs)) render({ ...data, jobs: data.jobs.slice(0, Number.isFinite(limit) ? limit : 20) });
    else render(data);
    return 0;
  }

  if (command === "job") {
    if (!args[0]) throw new Error("job requires <job_id>");
    render(await requestJson(endpoint(base, `/agent/jobs/${encodeURIComponent(args[0])}`)));
    return 0;
  }

  if (command === "stats") {
    render(await requestJson(endpoint(base, "/agent/stats")));
    return 0;
  }

  if (command === "reputation") {
    if (!args[0]) throw new Error("reputation requires <wallet>");
    render(await requestJson(endpoint(base, `/agent/reputation/${encodeURIComponent(args[0])}`)));
    return 0;
  }

  if (command === "claim") {
    const [jobId, workerWallet] = args;
    if (!jobId || !workerWallet) throw new Error("claim requires <job_id> <worker_wallet>");
    const url = endpoint(base, `/agent/jobs/${encodeURIComponent(jobId)}/claim`);
    console.error(`Claiming ${jobId} as ${workerWallet} via ${url}`);
    render(await requestJson(url, {
      method: "POST",
      body: JSON.stringify({ worker_wallet: workerWallet }),
    }));
    return 0;
  }

  if (command === "deliver") {
    const [jobId, workerWallet, deliverableUrl, ...summaryParts] = args;
    const summary = summaryParts.join(" ").trim();
    if (!jobId || !workerWallet || !deliverableUrl || !summary) {
      throw new Error("deliver requires <job_id> <worker_wallet> <deliverable_url> <summary...>");
    }
    const url = endpoint(base, `/agent/jobs/${encodeURIComponent(jobId)}/deliver`);
    console.error(`Delivering ${jobId} as ${workerWallet} via ${url}`);
    render(await requestJson(url, {
      method: "POST",
      body: JSON.stringify({
        worker_wallet: workerWallet,
        deliverable_url: deliverableUrl,
        result_summary: summary,
      }),
    }));
    return 0;
  }

  throw new Error(`Unknown command: ${command}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((error) => {
    console.error(error.message);
    if (error.data) console.error(JSON.stringify(error.data, null, 2));
    process.exitCode = 1;
  });
}
