import type { ExecutionRequest, ResourceResult } from "@aicoo/sharedos-contracts";
import { agentExecutionCapability } from "@aicoo/sharedos-core";
import { createFileTools } from "@aicoo/sharedos-os";
import { SharedOSExecutor, StandardRuntime, type AgentTurnDriver } from "@aicoo/sharedos-runtime";
import {
  InMemoryResourceProvider,
  createTestContext,
  createTestGrant,
  createTestKernel,
} from "@aicoo/sharedos-testkit";

const now = "2026-09-09T00:00:00.000Z";
const requester = { kind: "agent", agentId: "campaign-builder" } as const;
const reviewer = { kind: "agent", agentId: "nexuseval-reviewer" } as const;
const owner = { kind: "human", userId: "nishant" } as const;

const files = new InMemoryResourceProvider("files", async (operation): Promise<ResourceResult> => ({
  operationId: operation.operationId,
  status: "succeeded",
  output: {
    artifact: {
      path: "Workspace/campaign/a.md",
      text: "Launch copy: Fastest guaranteed growth in the market. Buy now.",
    },
  },
  completedAt: operation.context.now,
}));

const grants = [
  createTestGrant({
    id: "grant-invoke-reviewer",
    subject: reviewer,
    issuer: owner,
    capabilities: [agentExecutionCapability(reviewer, owner)],
    purposes: ["marketing-qa"],
  }),
  createTestGrant({
    id: "grant-read-campaign-a",
    subject: reviewer,
    issuer: owner,
    capabilities: [
      {
        resource: { namespace: "files", path: ["Workspace", "campaign", "a.md"], owner },
        actions: ["search"],
        scope: "self",
      },
    ],
    purposes: ["marketing-qa"],
  }),
];

const { kernel } = createTestKernel({ grants });
for (const handler of createFileTools(files)) kernel.registerTool(handler);

const context = createTestContext({
  actor: reviewer,
  authority: owner,
  owner,
  purpose: "marketing-qa",
  enabledToolNamespaces: ["files"],
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
              id: "read-campaign",
              tool: "files.search",
              arguments: { path: ["Workspace", "campaign", "a.md"], query: "launch copy" },
              traceId: context.traceId,
              requestedAt: now,
            },
          };
        }

        if (input.result.status !== "succeeded") {
          return { type: "complete", output: { decision: "BLOCK", reason: input.result.error.code } };
        }

        return {
          type: "complete",
          output: {
            decision: "WARN",
            route: "nexuseval.smallest-matching-preflight",
            evidence: [
              "Claim uses an absolute guarantee ('guaranteed growth') that should be substantiated or softened.",
              "Buyer-controlled policy would require an explicit QA/spend grant before a paid NexusEval call.",
            ],
            syntheticPurchaseMade: false,
          },
        };
      },
    };
  },
};

const tools = await kernel.listTools(context);
const request: ExecutionRequest = {
  version: "1",
  executionId: "nexuseval-sharedos-demo-1",
  agent: reviewer,
  context,
  message: {
    version: "1",
    id: "msg-1",
    sender: requester,
    receiver: reviewer,
    purpose: context.purpose,
    payload: { artifact: "Workspace/campaign/a.md", requestedAction: "preflight" },
    traceId: context.traceId,
    createdAt: now,
  },
  tools: [...tools],
};

const result = await new SharedOSExecutor(kernel, new StandardRuntime(driver), {
  clock: () => now,
  createId: (() => {
    let n = 0;
    return () => `event-${++n}`;
  })(),
}).execute(request);

console.log(JSON.stringify({ visibleTools: tools.map(t => t.name), result }, null, 2));