import { execFileSync } from "node:child_process";

const commands = [
  ["pnpm", ["--filter", "@zaydiscold/alltrails-cli", "cli", "doctor", "--json"]],
  ["pnpm", ["--filter", "@zaydiscold/alltrails-cli", "cli", "api-map", "summary", "--json"]],
  ["pnpm", ["--filter", "@zaydiscold/alltrails-cli", "cli", "trail", "plan", "10027248", "--json"]]
];

for (const [cmd, args] of commands) {
  execFileSync(cmd, args, { stdio: "inherit" });
}

