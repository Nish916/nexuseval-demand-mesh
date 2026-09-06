const EXECUTION_MARKET = "https://api.execution.market";
const BASE_RPC = "https://mainnet.base.org";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const PAYOUT_WALLET = "0xeD7E99F4a81CbaEeFe1B8eceDeBCdA812aa15C73";

const DIGITAL_CATEGORIES = new Set([
  "research",
  "data_processing",
  "content_generation",
  "code_execution",
  "api_integration",
  "creative",
  "multi_step_workflow",
]);

const BAD_EVIDENCE = new Set([
  "photo",
  "photo_geo",
  "video",
  "receipt",
  "signature",
  "notarized",
  "measurement",
  "gps",
]);

async function rpc(method, params) {
  const r = await fetch(BASE_RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!r.ok) throw new Error(`Base RPC HTTP ${r.status}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || "Base RPC error");
  return j.result;
}

function eligible(t) {
  const target = String(t.target_executor_type || "any").toLowerCase();
  if (!new Set(["agent", "any"]).has(target)) return false;

  const category = String(t.category || "").toLowerCase();
  if (category && !DIGITAL_CATEGORIES.has(category)) return false;

  const evidence = Array.isArray(t.evidence_required) ? t.evidence_required : [];
  if (evidence.some((x) => BAD_EVIDENCE.has(String(x).toLowerCase()))) return false;

  return true;
}

function bounty(t) {
  const n = Number(t.bounty_usd ?? t.bounty ?? 0);
  return Number.isFinite(n) ? n : 0;
}

async function getWalletBalances() {
  const ethHex = await rpc("eth_getBalance", [PAYOUT_WALLET, "latest"]);
  const balanceOfData = "0x70a08231" + PAYOUT_WALLET.slice(2).toLowerCase().padStart(64, "0");
  const usdcHex = await rpc("eth_call", [{ to: USDC_BASE, data: balanceOfData }, "latest"]);

  return {
    eth: Number(BigInt(ethHex)) / 1e18,
    usdc: Number(BigInt(usdcHex)) / 1e6,
  };
}

export default async function handler(req, res) {
  try {
    const tasksResp = await fetch(`${EXECUTION_MARKET}/api/v1/tasks/available?limit=100`, {
      headers: { "user-agent": "NexusEval-Cloud-Worker/1.0" },
    });

    if (!tasksResp.ok) {
      throw new Error(`Execution Market HTTP ${tasksResp.status}`);
    }

    const raw = await tasksResp.json();
    const tasks = Array.isArray(raw)
      ? raw
      : raw.tasks || raw.data || raw.results || [];

    const eligibleTasks = tasks
      .filter(eligible)
      .sort((a, b) => bounty(b) - bounty(a));

    const balances = await getWalletBalances().catch((error) => ({
      eth: null,
      usdc: null,
      error: error.message,
    }));

    const summary = {
      ok: true,
      checked_at: new Date().toISOString(),
      payout_wallet: PAYOUT_WALLET,
      base_balance: balances,
      execution_market: {
        total_available: tasks.length,
        eligible_digital: eligibleTasks.length,
        eligible_bounty_usd_total: eligibleTasks.reduce((sum, t) => sum + bounty(t), 0),
        top_tasks: eligibleTasks.slice(0, 20).map((t) => ({
          id: t.id || t.task_id,
          title: t.title || "",
          category: t.category || "",
          target_executor_type: t.target_executor_type || "any",
          bounty_usd: bounty(t),
          evidence_required: t.evidence_required || [],
        })),
      },
      mode: "cloud_scan_only",
      note: "This cloud job discovers legitimate paid work and checks the payout wallet. Authenticated applications still require an ERC-8128 OWS signer; no wallet secret is stored in this repository.",
    };

    console.log(JSON.stringify({
      type: "nexuseval_execution_market_watch",
      checked_at: summary.checked_at,
      eligible_tasks: eligibleTasks.length,
      eligible_bounty_usd_total: summary.execution_market.eligible_bounty_usd_total,
      base_usdc: balances.usdc,
      base_eth: balances.eth,
    }));

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(summary);
  } catch (error) {
    console.error("execution-market-watch", error);
    return res.status(500).json({
      ok: false,
      checked_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
