import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const WORKER_NAME = "bosses-tal-af";
const ROUTES = [{ pattern: "bosses.tal.af", custom_domain: true }];

const wranglerPath = resolve("dist/server/wrangler.json");
const config = JSON.parse(readFileSync(wranglerPath, "utf8"));

config.name = WORKER_NAME;
config.routes = ROUTES;
delete config.workers_dev;

writeFileSync(wranglerPath, JSON.stringify(config, null, 2) + "\n");

console.log(`[patch-wrangler] name=${WORKER_NAME} routes=${JSON.stringify(ROUTES)}`);
