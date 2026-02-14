# @sanctumai/mcp-server

**SanctumAI MCP Server** — A local-first credential vault and [CRP](https://github.com/SanctumSec/crp-spec) provider for AI agents.

Securely store, retrieve, and manage credentials directly from your AI tools via the [Model Context Protocol](https://modelcontextprotocol.io).

## Installation

```bash
# Run directly
npx @sanctumai/mcp-server

# Or install globally
npm install -g @sanctumai/mcp-server

# Or as a project dependency
npm install @sanctumai/mcp-server
```

The correct binary for your platform is installed automatically via optional dependencies.

### Manual Binary Install

Download the binary for your platform from [GitHub Releases](https://github.com/SanctumSec/sanctum/releases) and place it on your `PATH`.

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sanctum": {
      "command": "npx",
      "args": ["-y", "@sanctumai/mcp-server"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sanctum": {
      "command": "npx",
      "args": ["-y", "@sanctumai/mcp-server"]
    }
  }
}
```

### Windsurf

Add to `~/.windsurf/mcp.json`:

```json
{
  "mcpServers": {
    "sanctum": {
      "command": "npx",
      "args": ["-y", "@sanctumai/mcp-server"]
    }
  }
}
```

### VS Code / VS Code Insiders

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "sanctum": {
      "command": "npx",
      "args": ["-y", "@sanctumai/mcp-server"]
    }
  }
}
```

### Claude Code (claude code CLI)

```bash
claude mcp add sanctum -- npx -y @sanctumai/mcp-server
```

Or add to `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "sanctum": {
      "command": "npx",
      "args": ["-y", "@sanctumai/mcp-server"]
    }
  }
}
```

### OpenAI Codex

Add to your Codex MCP configuration:

```json
{
  "mcpServers": {
    "sanctum": {
      "command": "npx",
      "args": ["-y", "@sanctumai/mcp-server"]
    }
  }
}
```

### Anthropic CoWork

Add to your CoWork MCP configuration:

```json
{
  "mcpServers": {
    "sanctum": {
      "command": "npx",
      "args": ["-y", "@sanctumai/mcp-server"]
    }
  }
}
```

### Any MCP-Compatible Client

SanctumAI uses stdio transport. Any MCP client can connect:

```bash
npx @sanctumai/mcp-server
```

Or use the binary directly after installing:

```bash
sanctum --mcp
```

## Tools

### `vault_store`

Store a credential with metadata.

```json
{
  "name": "vault_store",
  "arguments": {
    "key": "aws/production",
    "value": "AKIA...",
    "metadata": { "service": "aws", "environment": "production" },
    "ttl": 3600
  }
}
```

**Returns:** `{ "stored": true, "key": "aws/production", "expires_at": "2025-01-01T01:00:00Z" }`

### `vault_retrieve`

Retrieve a credential. Access is policy-checked and audited.

```json
{
  "name": "vault_retrieve",
  "arguments": {
    "key": "aws/production",
    "purpose": "Deploy staging environment"
  }
}
```

**Returns:** `{ "key": "aws/production", "value": "AKIA...", "metadata": { ... } }`

### `vault_delete`

Remove a credential from the vault.

```json
{
  "name": "vault_delete",
  "arguments": { "key": "aws/production" }
}
```

### `vault_list`

List available credentials (values are never returned).

```json
{
  "name": "vault_list",
  "arguments": { "prefix": "aws/", "tags": ["production"] }
}
```

**Returns:** `{ "credentials": [{ "key": "aws/production", "metadata": { ... }, "created_at": "..." }] }`

### `credential_resolve`

Resolve a credential for a downstream service via [CRP](https://github.com/SanctumSec/crp-spec).

```json
{
  "name": "credential_resolve",
  "arguments": {
    "service": "github.com",
    "scope": ["repo:read", "repo:write"],
    "requester": "cursor/workspace-abc"
  }
}
```

**Returns:** `{ "credential": { ... }, "lease_id": "lease_abc123", "expires_at": "..." }`

### `credential_lease`

Manage CRP credential leases — renew or revoke.

```json
{
  "name": "credential_lease",
  "arguments": {
    "lease_id": "lease_abc123",
    "action": "renew"
  }
}
```

### `policy_check`

Validate an access request against policy rules without retrieving the credential.

```json
{
  "name": "policy_check",
  "arguments": {
    "key": "aws/production",
    "requester": "agent:deploy-bot",
    "action": "retrieve"
  }
}
```

**Returns:** `{ "allowed": true, "policy": "deploy-agents-aws", "reason": "Matched role: deploy" }`

### `audit_log`

Query the audit trail for credential access events.

```json
{
  "name": "audit_log",
  "arguments": {
    "key": "aws/production",
    "since": "2025-01-01T00:00:00Z",
    "limit": 50
  }
}
```

**Returns:** `{ "events": [{ "action": "retrieve", "requester": "...", "timestamp": "...", "policy": "..." }] }`

## CRP — Credential Resolution Protocol

SanctumAI implements the [Credential Resolution Protocol](https://github.com/SanctumSec/crp-spec) for standardized credential exchange between AI agents and services. CRP provides:

- **Scoped access** — Credentials are issued with specific permissions
- **Lease management** — Time-bound access with renewal and revocation
- **Audit trail** — Every access is logged with requester, purpose, and policy

Learn more at [crp.dev](https://crp.dev) or read the [spec](https://github.com/SanctumSec/crp-spec).

## SDKs

- **npm:** [@sanctumai/sdk](https://www.npmjs.com/package/@sanctumai/sdk)
- **PyPI:** [sanctumai](https://pypi.org/project/sanctumai/)
- **Crates.io:** [sanctumai](https://crates.io/crates/sanctumai)
- **Go:** [github.com/SanctumSec/sanctum-go](https://github.com/SanctumSec/sanctum-go)

## Supported Platforms

| Platform | Architecture | Package |
|----------|-------------|---------|
| macOS | Apple Silicon | `@sanctumai/mcp-server-darwin-arm64` |
| macOS | Intel | `@sanctumai/mcp-server-darwin-x64` |
| Linux | x64 | `@sanctumai/mcp-server-linux-x64` |
| Linux | ARM64 | `@sanctumai/mcp-server-linux-arm64` |
| Windows | x64 | `@sanctumai/mcp-server-win32-x64` |
| Windows | ARM64 | `@sanctumai/mcp-server-win32-arm64` |

## Links

- **Website:** [sanctumai.dev](https://sanctumai.dev)
- **CRP Spec:** [crp.dev](https://crp.dev)
- **GitHub:** [github.com/SanctumSec/sanctum](https://github.com/SanctumSec/sanctum)
- **MCP Discussion:** [#2246](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2246)
- **X:** [@SanctumSec](https://x.com/SanctumSec)

## License

MIT — see [LICENSE](./LICENSE).

<!-- mcp-name: io.github.sanctumsec/sanctum -->
