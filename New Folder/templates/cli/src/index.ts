#!/usr/bin/env node
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    name: { type: "string", short: "n", default: "world" },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help) {
  console.log("Usage: __NAME__ [--name <name>]");
  process.exit(0);
}

console.log(`Hello, ${values.name}!`);
