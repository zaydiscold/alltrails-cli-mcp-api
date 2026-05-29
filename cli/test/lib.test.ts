import { afterEach, describe, expect, test, vi } from "vitest";
import { executePlan, planTrailDetail, planTrailSearch, planWrite, routeSummary, searchRoutes } from "../src/lib.js";

const originalToken = process.env.ALLTRAILS_ACCESS_TOKEN;

afterEach(() => {
  if (originalToken === undefined) delete process.env.ALLTRAILS_ACCESS_TOKEN;
  else process.env.ALLTRAILS_ACCESS_TOKEN = originalToken;

  vi.restoreAllMocks();
});

describe("alltrails route map", () => {
  test("summarizes bundled routes", () => {
    const summary = routeSummary();
    expect(summary.count).toBeGreaterThan(10);
    expect(summary.mutatingRoutes).toBeGreaterThan(0);
  });

  test("searches route evidence", () => {
    expect(searchRoutes("offline").some((route) => route.id === "offline-map")).toBe(true);
  });
});

describe("dry-run planners", () => {
  test("plans trail detail without mutating", () => {
    const plan = planTrailDetail("10027248");
    expect(plan.url).toContain("/api/alltrails/v3/trails/10027248");
    expect(plan.url).toContain("detail=offline");
    expect(plan.mutatesAccount).toBe(false);
  });

  test("plans search query filters", () => {
    const plan = planTrailSearch({ query: "Half Dome", lat: 37.7, lng: -119.5, dogFriendly: true });
    expect(plan.url).toContain("q=Half+Dome");
    expect(plan.url).toContain("dog_friendly=true");
  });

  test("defaults write plans to dry-run but does not use an env gate", () => {
    const plan = planWrite("favorite-add", "10027248", true);
    expect(plan.mutatesAccount).toBe(true);
    expect(plan.mode).toBe("dry_run");
    expect(plan.liveWriteAllowed).toBe(true);
    expect(plan.risk).toBe("write-mutate");
  });

  test("dry-runs write execution without auth or network", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const plan = planWrite("favorite-add", "10027248", true);
    const result = await executePlan(plan, { fetchImpl });

    expect(result.statusText).toBe("DRY_RUN");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("executes a live personal write with caller-owned auth and no env gate", async () => {
    process.env.ALLTRAILS_ACCESS_TOKEN = "test-token";
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }));
    const warn = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const plan = planWrite("favorite-add", "10027248", false);

    const result = await executePlan(plan, { fetchImpl });

    expect(result.ok).toBe(true);
    expect(warn).toHaveBeenCalledWith("[WRITES TO LIVE ALLTRAILS] favorite-add will modify your AllTrails account.");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://www.alltrails.com/api/alltrails/v3/favorites/10027248",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ authorization: "Bearer test-token" })
      })
    );
  });
});
