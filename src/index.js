"use strict";

const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const PLATFORM_MAP = {
  "darwin-arm64": "@sanctumai/mcp-server-darwin-arm64",
  "darwin-x64": "@sanctumai/mcp-server-darwin-x64",
  "linux-x64": "@sanctumai/mcp-server-linux-x64",
  "linux-arm64": "@sanctumai/mcp-server-linux-arm64",
  "win32-x64": "@sanctumai/mcp-server-win32-x64",
  "win32-arm64": "@sanctumai/mcp-server-win32-arm64",
};

/**
 * Resolve the path to the sanctum-mcp binary for the current platform.
 * @returns {string} Absolute path to the binary
 * @throws {Error} If platform is unsupported or package not installed
 */
function getBinaryPath() {
  const platformKey = `${process.platform}-${os.arch()}`;
  const pkg = PLATFORM_MAP[platformKey];

  if (!pkg) {
    throw new Error(`Unsupported platform: ${platformKey}`);
  }

  const pkgDir = path.dirname(require.resolve(`${pkg}/package.json`));
  const ext = process.platform === "win32" ? ".exe" : "";
  return path.join(pkgDir, `sanctum-mcp${ext}`);
}

/**
 * Spawn the sanctum-mcp server process.
 * @param {string[]} [args=[]] - CLI arguments
 * @param {object} [options={}] - spawn options (merged with defaults)
 * @returns {import("child_process").ChildProcess}
 */
function startServer(args = [], options = {}) {
  const binPath = getBinaryPath();
  return spawn(binPath, args, {
    stdio: ["pipe", "pipe", "inherit"],
    ...options,
  });
}

module.exports = { getBinaryPath, startServer, PLATFORM_MAP };
