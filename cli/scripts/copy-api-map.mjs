import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const source = resolve(root, "api-map");
const target = resolve(here, "../dist/api-map");

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });

