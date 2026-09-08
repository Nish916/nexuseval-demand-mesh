import type { ExecutionRequest, ResourceResult } from "@aicoo/sharedos-contracts";
import { agentExecutionCapability } from "@aicoo/sharedos-core";
import { SharedOSExecutor, StandardRuntime, type AgentTurnDriver } from "@aicoo/sharedos-runtime";
import {
  InMemoryResourceProvider,
  createTestContext,
  createTestGrant,
  createTestKernel,
} from "@aicoo/sharedos-testkit";

/**
 * Hackathon demo: one buyer agent delegates one marketing-preflight task to
 * NexusEval QA. The worker receives only the approved asset and QA capability.
 *
 * This mirrors the SharedOS quickstart execution model while changing the
 * resource and purpose to a real NexusEval buyer/seller workflow.
 */
const now = "2026-09-09T00:00:00.000Z";
const buyer = { kind: "agent", agentId: "buyer-agent" } as const;
const qaAgent = { kind: "agent", agentId: "nexuseval-qa" } as const;
const owner = { kind: "human", userId: "nishant" } as const;

// The approved asset resource. A production adapter would resolve an asset ID
// rather than embedding the content in the request message.
const assets = new InMemoryResourceProvider(
  "marketing",
  async (operation): Promise<ResourceResult> => {
    const path = operation.resource.path.join("/");
    if (path !== "campaigns/launch-email-1") {
      return {
        operationId: operation.operationId,
        status: "failed",
        error: { code: "NOT_FOUND", message: "Asset not available in this grant." },
        completedAt: operation.context.now,
      };
    }

    // Deterministic stand-in for the NexusEval endpoint so the permission
    // boundary can be demoed without consuming money or external credentials.
    return {
      operationId: operation.operationId,
      status: "succeeded",
      output: {
        decision: "WARN",
        findings: [
          "CTA is present but not specific about the next action.",
          "One performance claim needs a source or softer wording.",
        ],
        releaseRecommendation: "revise_then_send",
      },
      completedAt: operation.context.now,
    };
  },
);

const grants = [
  createTestGrant({
    id: "grant-invoke-nexuseval",
    subject: qaAgent,
    issuer: owner,
    capabilities: [agentExecutionCapability(qaAgent, owner)],
    purposes: ["marketing-preflight"],
  }),
  createTestGrant({
    id: "grant-one-marketing-asset",
    subject: qaAgent,
    issuer: owner,
    capabilities: [
      {
        resource: {
          namespace: "marketing",
          path: ["campaigns", "launch-email-1"],
          owner,
        },
        actions: ["evaluate"],
        scope: "exact",
      },
    ],
    purposes: ["marketing-preflight"],
  }),
];

const { kernel } = createTestKernel({ grants });

kernel.registerTool({
  name: "marketing.evaluate",
  description: "Run the approved marketing asset through NexusEval preflight.",
  resourceNamespace: "marketing",
  action: "evaluate",
  async execute(operation) {
    return assets.execute(operation);
  },
});

const context = createTestContext({
  actor: qaAgent,
  authority: owner,
  owner,
  purpose: "marketing-preflight",
  enabledToolNamespaces: ["marketing"],
  now,
});

const driver: AgentTurnDriver = {
  async open() {
    return {
      async next(input) {
        if (input.type === "start") {
          return {
            type: "tool_call",
            call: {
              id: "call-marketing-preflight",
              tool: "marketing.evaluate",
              arguments: { path: ["campaigns", "launch-email-1"] },
              traceId: context.traceId,
              requestedAt: now,
            },
          };
        }

        return input.result.status === "succeeded"
          ? { type: "complete", output: { qa: input.result.output } }
          : { type: "complete", output: { error: input.result.error.code } };
      },
    };
  },
};

const tools = await kernel.listTools(context);
const request: ExecutionRequest = {
  version: "1",
  executionId: "nexuseval-demo-1",
  agent: qaAgent,
  context,
  message: {
    version: "1",
    id: "buyer-request-1",
    sender: buyer,
    receiver: qaAgent,
    purpose: context.purpose,
    payload: { assetId: "launch-email-1", requestedCheck: "preflight" },
    traceId: context.traceId,
    createdAt: now,
  },
  tools: [...tools],
};

let eventSequence = 0;
const result = await new SharedOSExecutor(kernel, new StandardRuntime(driver), {
  clock: () => now,
  createId: () => `event-${(eventSequence += 1)}`,
}).execute(request);

console.log({
  visibleTools: tools.map(({ name }) => name),
  status: result.status,
  output: result.status === "succeeded" ? result.output : result,
});
