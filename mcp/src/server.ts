#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  executePlan,
  planActivities,
  planCustomRequest,
  planMe,
  planOfflineMap,
  planTrailDetail,
  planTrailSearch,
  planWrite,
  routeSummary,
  routes,
  searchRoutes,
  type HttpMethod
} from "@zaydiscold/alltrails-cli/lib";

const server = new McpServer({
  name: "alltrails-mcp",
  version: "0.1.0"
});

function jsonResponse(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }]
  };
}

server.registerTool(
  "alltrails_api_map_summary",
  {
    title: "AllTrails API Map Summary",
    description: "Summarize bundled AllTrails route evidence. This reads local files only.",
    inputSchema: {}
  },
  async () => jsonResponse(routeSummary())
);

server.registerTool(
  "alltrails_routes",
  {
    title: "AllTrails Routes",
    description: "List or search bundled AllTrails route evidence.",
    inputSchema: {
      query: z.string().optional(),
      surface: z.string().optional(),
      mutationsOnly: z.boolean().default(false),
      limit: z.number().int().min(1).max(200).default(80)
    }
  },
  async ({ query, surface, mutationsOnly, limit }) => {
    let selected = query ? searchRoutes(query, limit) : routes.slice(0, limit);
    if (surface) selected = selected.filter((route) => route.surface === surface);
    if (mutationsOnly) selected = selected.filter((route) => route.mutatesAccount);
    return jsonResponse({ count: selected.length, routes: selected });
  }
);

server.registerTool(
  "alltrails_trail_plan",
  {
    title: "AllTrails Trail Plan",
    description: "Build a trail detail URL plan.",
    inputSchema: {
      trailId: z.string(),
      detail: z.string().default("offline")
    }
  },
  async ({ trailId, detail }) => jsonResponse(planTrailDetail(trailId, detail))
);

server.registerTool(
  "alltrails_search_plan",
  {
    title: "AllTrails Search Plan",
    description: "Build a trail search URL plan.",
    inputSchema: {
      query: z.string().optional(),
      lat: z.union([z.string(), z.number()]).optional(),
      lng: z.union([z.string(), z.number()]).optional(),
      radius: z.union([z.string(), z.number()]).optional(),
      limit: z.union([z.string(), z.number()]).optional(),
      difficulty: z.string().optional(),
      dogFriendly: z.boolean().default(false),
      kidFriendly: z.boolean().default(false)
    }
  },
  async (input) => jsonResponse(planTrailSearch(input))
);

server.registerTool(
  "alltrails_offline_map_plan",
  {
    title: "AllTrails Offline Map Plan",
    description: "Build an offline map metadata plan.",
    inputSchema: {
      region: z.string()
    }
  },
  async ({ region }) => jsonResponse(planOfflineMap(region))
);

server.registerTool(
  "alltrails_write_plan",
  {
    title: "AllTrails Write Plan",
    description: "Build a dry-run personal write plan. This does not submit.",
    inputSchema: {
      action: z.string(),
      id: z.string().default("TARGET_ID"),
      body: z.unknown().optional()
    }
  },
  async ({ action, id, body }) => jsonResponse(planWrite(action, id, true, body))
);

server.registerTool(
  "alltrails_live_read",
  {
    title: "AllTrails Live Read",
    description: "Execute a live AllTrails GET using caller-owned ALLTRAILS_ACCESS_TOKEN or ALLTRAILS_COOKIE.",
    inputSchema: {
      kind: z.enum(["trail", "search", "me", "activities", "offline-map"]),
      id: z.string().optional(),
      query: z.string().optional(),
      detail: z.string().default("offline"),
      limit: z.union([z.string(), z.number()]).optional(),
      fullBody: z.boolean().default(false)
    }
  },
  async ({ kind, id, query, detail, limit, fullBody }) => {
    const plan =
      kind === "trail"
        ? planTrailDetail(id ?? "TARGET_ID", detail)
        : kind === "search"
          ? planTrailSearch({ query, limit })
          : kind === "me"
            ? planMe()
            : kind === "activities"
              ? planActivities(id ?? "me", limit)
              : planOfflineMap(id ?? "REGION");
    return jsonResponse(await executePlan(plan, { fullBody }));
  }
);

server.registerTool(
  "alltrails_live_write",
  {
    title: "AllTrails Live Write",
    description: "Execute a personal live AllTrails write. Requires caller-owned auth. Use dryRun=true to avoid mutation.",
    inputSchema: {
      action: z.string(),
      id: z.string(),
      dryRun: z.boolean().default(false),
      body: z.unknown().optional(),
      fullBody: z.boolean().default(false)
    }
  },
  async ({ action, id, dryRun, body, fullBody }) => jsonResponse(await executePlan(planWrite(action, id, dryRun, body), { dryRun, fullBody }))
);

server.registerTool(
  "alltrails_live_request",
  {
    title: "AllTrails Live Request",
    description: "Execute a custom personal live AllTrails request for newly captured routes. Use dryRun=true to avoid mutation.",
    inputSchema: {
      method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
      pathOrUrl: z.string(),
      dryRun: z.boolean().default(false),
      body: z.unknown().optional(),
      fullBody: z.boolean().default(false)
    }
  },
  async ({ method, pathOrUrl, dryRun, body, fullBody }) =>
    jsonResponse(await executePlan(planCustomRequest(method as HttpMethod, pathOrUrl, dryRun, body), { dryRun, fullBody }))
);

const transport = new StdioServerTransport();
await server.connect(transport);
