export type RiskLevel = "read" | "write-safe" | "write-mutate" | "write-destructive";

export function riskMutatesAccount(risk: RiskLevel): boolean {
  return risk === "write-mutate" || risk === "write-destructive";
}

export function riskWarning(risk: RiskLevel, routeId: string): string | undefined {
  if (risk === "write-mutate") return `[WRITES TO LIVE ALLTRAILS] ${routeId} will modify your AllTrails account.`;
  if (risk === "write-destructive") return `[WRITES TO LIVE ALLTRAILS] ${routeId} can remove or destroy AllTrails account data.`;
  return undefined;
}
