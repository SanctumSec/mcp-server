#!/usr/bin/env node

"use strict";

const os = require("os");
const path = require("path");
const fs = require("fs");

const platformKey = `${process.platform}-${os.arch()}`;
const PLATFORM_MAP = {
  "darwin-arm64": "@sanctumai/mcp-server-darwin-arm64",
  "darwin-x64": "@sanctumai/mcp-server-darwin-x64",
  "linux-x64": "@sanctumai/mcp-server-linux-x64",
  "linux-arm64": "@sanctumai/mcp-server-linux-arm64",
  "win32-x64": "@sanctumai/mcp-server-win32-x64",
  "win32-arm64": "@sanctumai/mcp-server-win32-arm64",
};

const pkg = PLATFORM_MAP[platformKey];

if (!pkg) {
  console.warn(
    `[sanctum-mcp] Warning: No pre-built binary for ${platformKey}.`
  );
  process.exit(0);
}

try {
  const pkgDir = path.dirname(require.resolve(`${pkg}/package.json`));
  const ext = process.platform === "win32" ? ".exe" : "";
  const binPath = path.join(pkgDir, `sanctum-mcp${ext}`);

  if (!fs.existsSync(binPath)) {
    console.warn(
      `[sanctum-mcp] Warning: Platform package installed but binary not found at ${binPath}\n` +
        `This is expected during development. Binary will be included in release builds.`
    );
  }
} catch {
  console.warn(
    `[sanctum-mcp] Warning: Platform package ${pkg} not installed.\n` +
      `The server may not work. Try: npm install ${pkg}`
  );
}
