import { riskMutatesAccount, riskWarning, type RiskLevel } from "./lib/risk.js";

export type EvidenceLabel =
  | "official_export"
  | "browser_observed"
  | "community_inferred"
  | "subscription_gated"
  | "mutation_unverified"
  | "unverified";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type PlanMode = "dry_run" | "execute";

export interface ApiRoute {
  id: string;
  method: HttpMethod;
  path: string;
  labels: EvidenceLabel[];
  surface: string;
  description: string;
  mutatesAccount: boolean;
  requiresAuth: boolean;
  requiresSubscription: boolean;
  risk: RiskLevel;
}

export interface Plan {
  mode: PlanMode;
  routeId: string;
  method: HttpMethod;
  url: string;
  headersRequired: string[];
  mutatesAccount: boolean;
  requiresAuth: boolean;
  liveWriteAllowed: boolean;
  risk: RiskLevel;
  body?: unknown;
  notes: string[];
}

export interface ExecuteOptions {
  token?: string;
  cookie?: string;
  csrfToken?: string;
  body?: unknown;
  dryRun?: boolean;
  fullBody?: boolean;
  maxBodyBytes?: number;
  fetchImpl?: typeof fetch;
}

export interface ExecuteResult {
  ok: boolean;
  status: number;
  statusText: string;
  method: HttpMethod;
  url: string;
  mutatesAccount: boolean;
  requiresAuth: boolean;
  contentType: string | null;
  body: string;
  truncated: boolean;
}

export const BASE_URL = "https://www.alltrails.com";

export const routes: ApiRoute[] = [
  {
    id: "trail-detail-offline",
    method: "GET",
    path: "/api/alltrails/v3/trails/{trail_id}",
    labels: ["community_inferred", "browser_observed"],
    surface: "trail",
    description: "Trail detail/geometry payload with detail=offline.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-static-map",
    method: "GET",
    path: "/api/alltrails/v3/trails/{trail_id}/static_map",
    labels: ["browser_observed"],
    surface: "map",
    description: "Static map image endpoint observed inside AllTrails image proxy requests.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "map-static-map",
    method: "GET",
    path: "/api/alltrails/v3/maps/{map_id}/static_map",
    labels: ["browser_observed", "subscription_gated"],
    surface: "map",
    description: "Map static image endpoint observed from public trail page resources.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: true,
    risk: "read"
  },
  {
    id: "trail-search",
    method: "GET",
    path: "/api/alltrails/v3/trails/search",
    labels: ["unverified"],
    surface: "search",
    description: "Expected trail search route by query/location/filter.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-reviews",
    method: "GET",
    path: "/api/alltrails/v3/trails/{trail_id}/reviews",
    labels: ["unverified"],
    surface: "trail",
    description: "Trail review listing.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-photos",
    method: "GET",
    path: "/api/alltrails/v3/trails/{trail_id}/photos",
    labels: ["unverified"],
    surface: "trail",
    description: "Trail photo listing.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-recordings",
    method: "GET",
    path: "/api/alltrails/v3/trails/{trail_id}/recordings",
    labels: ["browser_observed", "unverified"],
    surface: "trail",
    description: "Community GPS recordings for a trail.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-gpx",
    method: "GET",
    path: "/api/alltrails/v3/trails/{trail_id}/gpx",
    labels: ["official_export", "subscription_gated", "unverified"],
    surface: "export",
    description: "GPX export/download route family.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: true,
    risk: "read"
  },
  {
    id: "user-me",
    method: "GET",
    path: "/api/alltrails/v3/user/me/",
    labels: ["unverified"],
    surface: "account",
    description: "Current authenticated profile.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "user-activities",
    method: "GET",
    path: "/api/alltrails/v3/user/{user_id}/activities",
    labels: ["unverified"],
    surface: "activity",
    description: "User activity list.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "activity-detail",
    method: "GET",
    path: "/api/alltrails/v3/activities/{activity_id}",
    labels: ["unverified"],
    surface: "activity",
    description: "Single activity detail.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "activity-upload",
    method: "POST",
    path: "/api/alltrails/v3/activities/upload",
    labels: ["mutation_unverified", "unverified"],
    surface: "activity",
    description: "Upload GPX/FIT activity recording.",
    mutatesAccount: true,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "write-mutate"
  },
  {
    id: "offline-map",
    method: "GET",
    path: "/api/alltrails/v3/maps/offline/{region}",
    labels: ["subscription_gated", "unverified"],
    surface: "offline",
    description: "Offline map metadata route family.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: true,
    risk: "read"
  },
  {
    id: "weather",
    method: "GET",
    path: "/api/alltrails/v3/weather/{lat}/{lng}",
    labels: ["subscription_gated", "unverified"],
    surface: "weather",
    description: "Weather overlay route family.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: true,
    risk: "read"
  },
  {
    id: "favorite-add",
    method: "POST",
    path: "/api/alltrails/v3/favorites/{trail_id}",
    labels: ["mutation_unverified", "unverified"],
    surface: "account",
    description: "Add trail to favorites.",
    mutatesAccount: true,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "write-mutate"
  },
  {
    id: "favorite-remove",
    method: "DELETE",
    path: "/api/alltrails/v3/favorites/{trail_id}",
    labels: ["mutation_unverified", "unverified"],
    surface: "account",
    description: "Remove trail from favorites.",
    mutatesAccount: true,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "write-mutate"
  },
  {
    id: "review-like",
    method: "POST",
    path: "/api/alltrails/v3/reviews/{review_id}/likes",
    labels: ["mutation_unverified", "unverified"],
    surface: "social",
    description: "Like a review.",
    mutatesAccount: true,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "write-mutate"
  },
  {
    id: "explore-search-v1",
    method: "POST",
    path: "/api/alltrails/explore/v1/search",
    labels: ["browser_observed"],
    surface: "search",
    description: "Explore and custom-route search endpoint observed during logged-in California/explore capture. POST is read-only search in this context.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "account-me-browser",
    method: "GET",
    path: "/api/alltrails/me",
    labels: ["browser_observed"],
    surface: "account",
    description: "Current authenticated user route observed from the logged-in browser session.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "geo-routing-info",
    method: "GET",
    path: "/api/alltrails/geo-service/routing/info",
    labels: ["browser_observed"],
    surface: "geo",
    description: "Routing service metadata used by explore/map surfaces.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-surface-types",
    method: "GET",
    path: "/api/alltrails/trails/{trail_id}/surface_types",
    labels: ["browser_observed"],
    surface: "trail",
    description: "Trail surface-type metadata observed from trail detail pages.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-v2-photos",
    method: "GET",
    path: "/api/alltrails/v2/trails/{trail_id}/photos",
    labels: ["browser_observed"],
    surface: "trail",
    description: "Trail photo list v2 endpoint observed from trail detail pages.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-photo-detail",
    method: "GET",
    path: "/api/alltrails/trails/{trail_id}/photos/{photo_id}",
    labels: ["browser_observed"],
    surface: "trail",
    description: "Trail photo detail/list endpoint observed with landscape and limit query keys.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "trail-weather-overview",
    method: "GET",
    path: "/api/alltrails/weather-service/v2/trails/{trail_id}/overview",
    labels: ["browser_observed"],
    surface: "weather",
    description: "Trail weather overview endpoint observed from detail pages.",
    mutatesAccount: false,
    requiresAuth: false,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "community-user-feeds",
    method: "GET",
    path: "/api/alltrails/community/blazes/v0/users/{user_id}/feeds",
    labels: ["browser_observed"],
    surface: "community",
    description: "Authenticated user community feed endpoint observed from /members/me.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "community-user-public-feed",
    method: "GET",
    path: "/api/alltrails/community/blazes/v0/users/{user_id}/feeds/public",
    labels: ["browser_observed"],
    surface: "community",
    description: "Public feed route for a user; observed with requested feed-item version query keys.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "community-user-public-feed-paged",
    method: "GET",
    path: "/api/alltrails/community/blazes//v0/users/{user_id}/feeds/public",
    labels: ["browser_observed"],
    surface: "community",
    description: "Paged public feed variant observed exactly with a double slash before v0.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "connect-user-connections",
    method: "GET",
    path: "/api/alltrails/connect/users/{user_id}/connections",
    labels: ["browser_observed"],
    surface: "social",
    description: "Connection list route observed from member/account pages.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "connect-user-connection-detail",
    method: "GET",
    path: "/api/alltrails/connect/users/{user_id}/connections/{connection_id}",
    labels: ["browser_observed"],
    surface: "social",
    description: "Single connection detail route observed from member/account pages.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "connect-my-mutuals",
    method: "GET",
    path: "/api/alltrails/connect/v0/my/mutuals/{user_id}",
    labels: ["browser_observed"],
    surface: "social",
    description: "Authenticated mutual-connection route observed from member/account pages.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "user-lists-browser",
    method: "GET",
    path: "/api/alltrails/users/{user_id}/lists",
    labels: ["browser_observed"],
    surface: "list",
    description: "Observed current/user lists endpoint from logged-in member pages.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "user-maps-browser",
    method: "GET",
    path: "/api/alltrails/users/{user_id}/maps",
    labels: ["browser_observed"],
    surface: "map",
    description: "Observed current/user maps endpoint from logged-in member pages.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  },
  {
    id: "user-completed-trails-browser",
    method: "GET",
    path: "/api/alltrails/users/{user_id}/trails/completed",
    labels: ["browser_observed"],
    surface: "activity",
    description: "Observed completed trails endpoint from /members/me/completed.",
    mutatesAccount: false,
    requiresAuth: true,
    requiresSubscription: false,
    risk: "read"
  }
];

export function searchRoutes(query: string, limit = 50): ApiRoute[] {
  const needle = query.trim().toLowerCase();
  return routes
    .filter((route) =>
      [route.id, route.method, route.path, route.surface, route.description, ...route.labels]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    )
    .slice(0, limit);
}

export function routeSummary() {
  const labelCounts = new Map<EvidenceLabel, number>();
  const surfaceCounts = new Map<string, number>();
  for (const route of routes) {
    for (const label of route.labels) {
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
    }
    surfaceCounts.set(route.surface, (surfaceCounts.get(route.surface) ?? 0) + 1);
  }
  return {
    count: routes.length,
    labels: Object.fromEntries([...labelCounts.entries()].sort()),
    surfaces: Object.fromEntries([...surfaceCounts.entries()].sort()),
    mutatingRoutes: routes.filter((route) => route.mutatesAccount).length,
    writeMode: "live_by_default_with_opt_in_dry_run"
  };
}

function buildUrl(path: string, replacements: Record<string, string>, query: Record<string, string | number | boolean | undefined> = {}) {
  let resolved = path;
  for (const [key, value] of Object.entries(replacements)) {
    resolved = resolved.replace(`{${key}}`, encodeURIComponent(value));
  }
  const [pathname, existingQuery] = resolved.split("?");
  const params = new URLSearchParams(existingQuery ?? "");
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== false && value !== "") {
      params.set(key, String(value));
    }
  }
  return `${BASE_URL}${pathname}${params.size ? `?${params.toString()}` : ""}`;
}

function routeById(id: string): ApiRoute | undefined {
  return routes.find((candidate) => candidate.id === id);
}

function authHeadersRequired(route: ApiRoute | undefined, mutatesAccount: boolean): string[] {
  const required = route?.requiresAuth || mutatesAccount ? ["ALLTRAILS_ACCESS_TOKEN or ALLTRAILS_COOKIE"] : [];
  if (route?.requiresSubscription) required.push("eligible AllTrails subscription may be required");
  if (mutatesAccount) required.push("live mutation warning is emitted to stderr; use --dry-run to avoid execution");
  return required;
}

function planForRoute(input: {
  routeId: string;
  method: HttpMethod;
  url: string;
  replacements?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  dryRun?: boolean;
  notes?: string[];
}): Plan {
  const route = routeById(input.routeId);
  const risk: RiskLevel = route?.risk ?? (input.method === "GET" ? "read" : "write-mutate");
  const mutatesAccount = route?.mutatesAccount ?? riskMutatesAccount(risk);
  const requiresAuth = Boolean(route?.requiresAuth || mutatesAccount);
  return {
    mode: input.dryRun ? "dry_run" : "execute",
    routeId: input.routeId,
    method: input.method,
    url: input.url,
    headersRequired: authHeadersRequired(route, mutatesAccount),
    mutatesAccount,
    requiresAuth,
    liveWriteAllowed: true,
    risk,
    body: input.body,
    notes: input.notes ?? []
  };
}

export function planTrailDetail(trailId: string, detail = "offline"): Plan {
  return planForRoute({
    routeId: "trail-detail-offline",
    method: "GET",
    url: buildUrl("/api/alltrails/v3/trails/{trail_id}", { trail_id: trailId }, { detail }),
    notes: ["Community-confirmed route family; schema should be refreshed from the current logged browser before publishing fixtures."]
  });
}

export function planTrailSearch(input: {
  query?: string;
  lat?: string | number;
  lng?: string | number;
  radius?: string | number;
  limit?: string | number;
  difficulty?: string;
  dogFriendly?: boolean;
  kidFriendly?: boolean;
}): Plan {
  return planForRoute({
    routeId: "trail-search",
    method: "GET",
    url: buildUrl(
      "/api/alltrails/v3/trails/search",
      {},
      {
        q: input.query,
        lat: input.lat,
        lng: input.lng,
        radius: input.radius,
        limit: input.limit,
        difficulty: input.difficulty,
        dog_friendly: input.dogFriendly,
        kid_friendly: input.kidFriendly
      }
    ),
    notes: ["Search route is expected but still marked unverified until captured from the logged browser."]
  });
}

export function planMe(): Plan {
  return planForRoute({
    routeId: "user-me",
    method: "GET",
    url: buildUrl("/api/alltrails/v3/user/me/", {}),
    notes: ["Do not persist returned account ids or profile payloads in repo fixtures."]
  });
}

export function planActivities(userId = "me", limit?: string | number): Plan {
  return planForRoute({
    routeId: "user-activities",
    method: "GET",
    url: buildUrl("/api/alltrails/v3/user/{user_id}/activities", { user_id: userId }, { limit }),
    notes: ["Account-specific activity pagination must be discovered from current browser state."]
  });
}

export function planOfflineMap(region: string): Plan {
  return planForRoute({
    routeId: "offline-map",
    method: "GET",
    url: buildUrl("/api/alltrails/v3/maps/offline/{region}", { region }),
    notes: ["Subscription-gated metadata route; do not publish paid/offline payload fixtures."]
  });
}

export function planWrite(action: string, id: string, dryRun = true, body?: unknown): Plan {
  const route = routeById(action);
  const method = route?.method ?? "POST";
  const path = route?.path ?? `/api/alltrails/v3/${action}/{id}`;
  return planForRoute({
    routeId: action,
    method,
    url: buildUrl(path, { trail_id: id, user_id: id, activity_id: id, review_id: id, map_id: id, region: id, lat: id, lng: id, id }),
    body,
    dryRun,
    notes: [
      dryRun ? "Dry-run write plan. Pass write execute without --dry-run to mutate the live account." : "Live write execution. This mutates the caller's AllTrails account.",
      "Execution requires ALLTRAILS_ACCESS_TOKEN or ALLTRAILS_COOKIE."
    ]
  });
}

export function planCustomRequest(method: HttpMethod, pathOrUrl: string, dryRun = false, body?: unknown): Plan {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  const risk: RiskLevel = method === "GET" ? "read" : method === "DELETE" ? "write-destructive" : "write-mutate";
  const mutatesAccount = riskMutatesAccount(risk);
  const requiresAuth = mutatesAccount;
  return {
    mode: dryRun ? "dry_run" : "execute",
    routeId: "custom",
    method,
    url,
    headersRequired: authHeadersRequired(undefined, mutatesAccount),
    mutatesAccount,
    requiresAuth,
    liveWriteAllowed: true,
    risk,
    body,
    notes: [
      "Custom live request path for newly captured routes.",
      mutatesAccount ? "This mutates the live account unless --dry-run is used." : "GET requests still require caller-owned auth when the endpoint is private."
    ]
  };
}

function getAuth(options: ExecuteOptions) {
  const token = options.token ?? process.env.ALLTRAILS_ACCESS_TOKEN;
  const cookie = options.cookie ?? process.env.ALLTRAILS_COOKIE;
  const csrfToken = options.csrfToken ?? process.env.ALLTRAILS_CSRF_TOKEN;
  return { token, cookie, csrfToken };
}

function stringifyBody(body: unknown): string | undefined {
  if (body === undefined) return undefined;
  if (typeof body === "string") return body;
  return JSON.stringify(body);
}

export async function executePlan(plan: Plan, options: ExecuteOptions = {}): Promise<ExecuteResult> {
  if (options.dryRun || plan.mode === "dry_run") {
    return {
      ok: true,
      status: 0,
      statusText: "DRY_RUN",
      method: plan.method,
      url: plan.url,
      mutatesAccount: plan.mutatesAccount,
      requiresAuth: plan.requiresAuth,
      contentType: "application/json",
      body: JSON.stringify(plan, null, 2),
      truncated: false
    };
  }

  const warning = riskWarning(plan.risk, plan.routeId);
  if (warning) {
    console.error(warning);
  }

  const { token, cookie, csrfToken } = getAuth(options);
  if (plan.requiresAuth && !token && !cookie) {
    throw new Error("Missing auth: set ALLTRAILS_ACCESS_TOKEN or ALLTRAILS_COOKIE outside the repo.");
  }

  const body = options.body ?? plan.body;
  const headers: Record<string, string> = {
    accept: "application/json, text/plain, */*",
    "user-agent": "alltrails-cli/0.1"
  };
  if (token) headers.authorization = `Bearer ${token}`;
  if (cookie) headers.cookie = cookie;
  if (csrfToken) headers["x-csrf-token"] = csrfToken;
  const serializedBody = stringifyBody(body);
  if (serializedBody !== undefined) headers["content-type"] = "application/json";

  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(plan.url, {
    method: plan.method,
    headers,
    body: plan.method === "GET" ? undefined : serializedBody
  });

  const text = await response.text();
  const max = options.fullBody ? Number.POSITIVE_INFINITY : options.maxBodyBytes ?? 4000;
  const truncated = text.length > max;
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    method: plan.method,
    url: plan.url,
    mutatesAccount: plan.mutatesAccount,
    requiresAuth: plan.requiresAuth,
    contentType: response.headers.get("content-type"),
    body: truncated ? text.slice(0, max) : text,
    truncated
  };
}

export function doctor() {
  return {
    ok: true,
    package: "@zaydiscold/alltrails-cli",
    mode: "personal_live_read_write_default",
    apiMapRoutes: routes.length,
    auth: process.env.ALLTRAILS_ACCESS_TOKEN || process.env.ALLTRAILS_COOKIE ? "configured" : "not_configured",
    writeBarrier: {
      envRequired: "none",
      dryRunOptIn: true,
      warning: "write-mutate and write-destructive operations emit a live account warning to stderr"
    }
  };
}

export type { RiskLevel };
