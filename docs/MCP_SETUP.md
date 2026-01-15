# MCP Server Setup Guide

This guide explains how to set up MCP (Model Context Protocol) servers for enhanced AI-assisted development.

## What is MCP?

MCP (Model Context Protocol) allows Claude Code to connect to external tools and services, enabling:

- Real-time documentation lookup
- GitHub integration (PRs, Issues, CI/CD)
- Database queries
- Browser automation
- And more

## Recommended MCP Servers

### 1. Context7 (Documentation Lookup)

Fetches up-to-date, version-specific documentation for libraries.

**Setup:**

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

**Usage:**

```
# In your prompt, add "use context7" to fetch latest docs
"Create a NestJS guard for JWT authentication. use context7"

# Or specify a library directly
"How do I use Prisma transactions? use context7"
```

**Benefits:**

- Always get current API documentation
- No more outdated or hallucinated methods
- Version-specific information

### 2. Sequential Thinking (Problem Solving)

Enables structured, step-by-step problem solving.

**Setup:**

```bash
claude mcp add sequential-thinking -- npx -y @anthropic/sequential-thinking-mcp@latest
```

**Usage:**

```
"Help me debug this authentication issue step by step"
"Design the architecture for a user notification system"
```

### 3. GitHub MCP (Repository Operations)

Direct interaction with GitHub repositories, issues, and PRs.

**Setup:**

```bash
# Requires GitHub token
export GITHUB_TOKEN=your_token_here
claude mcp add github -- npx -y @anthropic/github-mcp@latest
```

**Usage:**

```
"Create a PR for the current branch"
"List open issues labeled as bugs"
"Check the CI status for this PR"
```

### 4. Playwright MCP (Browser Automation)

Web automation and E2E testing support.

**Setup:**

```bash
claude mcp add playwright -- npx -y @anthropic/playwright-mcp@latest
```

**Usage:**

```
"Run the E2E tests and show me the failures"
"Take a screenshot of the login page"
"Debug why the form submission test is failing"
```

## Configuration File

MCP servers are configured in `~/.claude.json`. Here's a complete example:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key-optional"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/sequential-thinking-mcp@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/github-mcp@latest"],
      "env": {
        "GITHUB_TOKEN": "your-github-token"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/playwright-mcp@latest"]
    }
  }
}
```

## Quick Setup Script

Run this script to set up recommended MCP servers:

```bash
# From project root
./scripts/setup-mcp.sh
```

## Verifying Setup

After setup, verify MCP servers are working:

```bash
# List configured MCP servers
claude mcp list

# Test Context7
claude "What version of React is installed? use context7"
```

## Project-Specific Usage

### TDD with Context7

```
"Write a Vitest test for the UserService using the latest Vitest API. use context7"
```

### PR Review with GitHub MCP

```
"Review the changes in PR #123 and check if tests pass"
```

### E2E Debugging with Playwright

```
"The login E2E test is failing. Debug it with Playwright"
```

## Troubleshooting

### MCP server not starting

```bash
# Check if npx can run the package
npx -y @upstash/context7-mcp@latest --version

# Check Claude Code logs
claude --debug
```

### Context7 rate limiting

Get a free API key at [context7.com/dashboard](https://context7.com/dashboard) for higher limits.

### GitHub MCP authentication

Ensure your `GITHUB_TOKEN` has the required scopes:

- `repo` - Full repository access
- `workflow` - GitHub Actions access
- `read:org` - Organization access (if needed)

## Resources

- [Context7 Documentation](https://context7.com/docs)
- [Claude Code MCP Guide](https://code.claude.com/docs/en/mcp)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
