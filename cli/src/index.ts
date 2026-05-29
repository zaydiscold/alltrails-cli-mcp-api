#!/usr/bin/env node
import { Command } from "commander";
import {
  doctor,
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
} from "./lib.js";

function print(value: unknown, json = false) {
  if (json || typeof value !== "string") {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  console.log(value);
}

function parseJsonBody(value?: string) {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid --body-json: ${(error as Error).message}`);
  }
}

async function executeAndPrint(plan: ReturnType<typeof planTrailDetail>, options: { dryRun?: boolean; full?: boolean; json?: boolean; bodyJson?: string }) {
  try {
    const result = await executePlan(plan, {
      dryRun: Boolean(options.dryRun),
      fullBody: Boolean(options.full),
      body: parseJsonBody(options.bodyJson)
    });
    print(result, Boolean(options.json));
  } catch (error) {
    console.error(`error: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

const program = new Command();

program.name("alltrails-cli").description("Personal live AllTrails API map, CLI executor, and MCP companion. Writes are real unless --dry-run is passed.").version("0.1.0");

program
  .command("doctor")
  .option("--json", "print JSON")
  .action((options) => print(doctor(), options.json));

const apiMap = program.command("api-map").description("Inspect bundled route evidence.");

apiMap
  .command("summary")
  .option("--json", "print JSON")
  .action((options) => print(routeSummary(), options.json));

apiMap
  .command("routes")
  .option("--json", "print JSON")
  .option("--surface <surface>", "filter by surface")
  .option("--mutations-only", "show mutating routes only")
  .action((options) => {
    const filtered = routes.filter((route) => {
      if (options.surface && route.surface !== options.surface) return false;
      if (options.mutationsOnly && !route.mutatesAccount) return false;
      return true;
    });
    print({ count: filtered.length, routes: filtered }, options.json);
  });

apiMap
  .command("search")
  .argument("<query>")
  .option("--limit <n>", "max routes", "50")
  .option("--json", "print JSON")
  .action((query, options) => print({ query, routes: searchRoutes(query, Number(options.limit)) }, options.json));

const trail = program.command("trail").description("Trail route plans and live reads.");

trail
  .command("plan")
  .argument("<trail-id>")
  .option("--detail <detail>", "detail query value", "offline")
  .option("--json", "print JSON")
  .action((trailId, options) => print(planTrailDetail(trailId, options.detail), options.json));

trail
  .command("get")
  .argument("<trail-id>")
  .option("--detail <detail>", "detail query value", "offline")
  .option("--full", "print full response body instead of a bounded preview")
  .option("--dry-run", "print the execution plan without sending the request")
  .option("--json", "print JSON")
  .action((trailId, options) => executeAndPrint(planTrailDetail(trailId, options.detail), options));

const search = program.command("search").description("Trail search plans and live reads.");

function searchInput(query: string | undefined, options: Record<string, unknown>) {
  return {
    query,
    lat: options.lat as string | undefined,
    lng: options.lng as string | undefined,
    radius: options.radius as string | undefined,
    limit: options.limit as string | undefined,
    difficulty: options.difficulty as string | undefined,
    dogFriendly: Boolean(options.dogFriendly),
    kidFriendly: Boolean(options.kidFriendly)
  };
}

search
  .command("plan")
  .argument("[query]")
  .option("--lat <lat>")
  .option("--lng <lng>")
  .option("--radius <km>")
  .option("--limit <n>", "result limit", "10")
  .option("--difficulty <difficulty>")
  .option("--dog-friendly")
  .option("--kid-friendly")
  .option("--json", "print JSON")
  .action((query, options) => print(planTrailSearch(searchInput(query, options)), options.json));

search
  .command("get")
  .argument("[query]")
  .option("--lat <lat>")
  .option("--lng <lng>")
  .option("--radius <km>")
  .option("--limit <n>", "result limit", "10")
  .option("--difficulty <difficulty>")
  .option("--dog-friendly")
  .option("--kid-friendly")
  .option("--full", "print full response body instead of a bounded preview")
  .option("--dry-run", "print the execution plan without sending the request")
  .option("--json", "print JSON")
  .action((query, options) => executeAndPrint(planTrailSearch(searchInput(query, options)), options));

const me = program.command("me").description("Current-account route plan and live read.");

me.command("plan")
  .option("--json", "print JSON")
  .action((options) => print(planMe(), options.json));

me.command("get")
  .option("--full", "print full response body instead of a bounded preview")
  .option("--dry-run", "print the execution plan without sending the request")
  .option("--json", "print JSON")
  .action((options) => executeAndPrint(planMe(), options));

const activities = program.command("activities").description("Activity-list route plan and live read.");

activities
  .command("plan")
  .option("--user <id>", "user id or me", "me")
  .option("--limit <n>")
  .option("--json", "print JSON")
  .action((options) => print(planActivities(options.user, options.limit), options.json));

activities
  .command("get")
  .option("--user <id>", "user id or me", "me")
  .option("--limit <n>")
  .option("--full", "print full response body instead of a bounded preview")
  .option("--dry-run", "print the execution plan without sending the request")
  .option("--json", "print JSON")
  .action((options) => executeAndPrint(planActivities(options.user, options.limit), options));

const offlineMap = program.command("offline-map").description("Offline-map metadata plan and live read.");

offlineMap
  .command("plan")
  .argument("<region>")
  .option("--json", "print JSON")
  .action((region, options) => print(planOfflineMap(region), options.json));

offlineMap
  .command("get")
  .argument("<region>")
  .option("--full", "print full response body instead of a bounded preview")
  .option("--dry-run", "print the execution plan without sending the request")
  .option("--json", "print JSON")
  .action((region, options) => executeAndPrint(planOfflineMap(region), options));

const write = program.command("write").description("Live mutating routes. These modify AllTrails unless --dry-run is passed.");

write
  .command("plan")
  .argument("<action>")
  .argument("[id]", "target id", "TARGET_ID")
  .option("--body-json <json>", "JSON request body")
  .option("--json", "print JSON")
  .action((action, id, options) => print(planWrite(action, id, true, parseJsonBody(options.bodyJson)), options.json));

write
  .command("execute")
  .argument("<action>")
  .argument("[id]", "target id", "TARGET_ID")
  .option("--dry-run", "print the execution plan without sending the request")
  .option("--body-json <json>", "JSON request body")
  .option("--full", "print full response body instead of a bounded preview")
  .option("--json", "print JSON")
  .action((action, id, options) => executeAndPrint(planWrite(action, id, Boolean(options.dryRun), parseJsonBody(options.bodyJson)), options));

program
  .command("request")
  .description("Execute a custom live request for newly captured routes.")
  .argument("<method>")
  .argument("<path-or-url>")
  .option("--dry-run", "print the execution plan without sending the request")
  .option("--body-json <json>", "JSON request body")
  .option("--full", "print full response body instead of a bounded preview")
  .option("--json", "print JSON")
  .action((method, pathOrUrl, options) =>
    executeAndPrint(planCustomRequest(method.toUpperCase() as HttpMethod, pathOrUrl, Boolean(options.dryRun), parseJsonBody(options.bodyJson)), options)
  );

program
  .command("write-plan")
  .argument("<action>")
  .argument("[id]", "target id", "TARGET_ID")
  .option("--body-json <json>", "JSON request body")
  .option("--json", "print JSON")
  .description("Compatibility alias for write plan.")
  .action((action, id, options) => print(planWrite(action, id, true, parseJsonBody(options.bodyJson)), options.json));

program.parse();
