#!/usr/bin/env node

"use strict";

const { execFileSync } = require("child_process");
const path = require("path");
const os = require("os");

const PLATFORM_MAP = {
  "darwin-arm64": "@sanctumai/mcp-server-darwin-arm64",
  "darwin-x64": "@sanctumai/mcp-server-darwin-x64",
  "linux-x64": "@sanctumai/mcp-server-linux-x64",
  "linux-arm64": "@sanctumai/mcp-server-linux-arm64",
  "win32-x64": "@sanctumai/mcp-server-win32-x64",
  "win32-arm64": "@sanctumai/mcp-server-win32-arm64",
};

const platformKey = `${process.platform}-${os.arch()}`;
const pkg = PLATFORM_MAP[platformKey];

if (!pkg) {
  console.error(
    `Unsupported platform: ${platformKey}\n` +
      `Supported: ${Object.keys(PLATFORM_MAP).join(", ")}\n` +
      `Please file an issue: https://github.com/SanctumSec/sanctum/issues`
  );
  process.exit(1);
}

let binPath;
try {
  const pkgDir = path.dirname(require.resolve(`${pkg}/package.json`));
  const ext = process.platform === "win32" ? ".exe" : "";
  binPath = path.join(pkgDir, `sanctum-mcp${ext}`);
} catch {
  console.error(
    `Platform package ${pkg} is not installed.\n\n` +
      `This usually means the optional dependency wasn't installed for your platform.\n\n` +
      `Try reinstalling:\n` +
      `  npm install @sanctumai/mcp-server\n\n` +
      `Or install the platform package directly:\n` +
      `  npm install ${pkg}\n\n` +
      `For manual binary installation, visit:\n` +
      `  https://github.com/SanctumSec/sanctum/releases`
  );
  process.exit(1);
}

const args = process.argv.slice(2);

try {
  execFileSync(binPath, args, {
    stdio: "inherit",
    env: process.env,
  });
} catch (e) {
  if (e.status !== null) {
    process.exit(e.status);
  }
  throw e;
}
