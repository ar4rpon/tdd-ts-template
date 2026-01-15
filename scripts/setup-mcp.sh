#!/bin/bash

# MCP Server Setup Script
# This script helps set up recommended MCP servers for Claude Code

set -e

echo "=== MCP Server Setup ==="
echo ""

# Check if claude is installed
if ! command -v claude &> /dev/null; then
    echo "Error: Claude Code CLI is not installed."
    echo "Install it first: npm install -g @anthropic-ai/claude-code"
    exit 1
fi

# Function to add MCP server
add_mcp_server() {
    local name=$1
    local package=$2

    echo "Adding $name MCP server..."
    if claude mcp add "$name" -- npx -y "$package" 2>/dev/null; then
        echo "  ✓ $name added successfully"
    else
        echo "  ✗ Failed to add $name (may already exist)"
    fi
}

# Context7 - Documentation lookup
echo ""
echo "1. Context7 (Documentation Lookup)"
echo "   Fetches up-to-date library documentation"
add_mcp_server "context7" "@upstash/context7-mcp@latest"

# Sequential Thinking - Problem solving
echo ""
echo "2. Sequential Thinking (Problem Solving)"
echo "   Enables structured step-by-step analysis"
add_mcp_server "sequential-thinking" "@modelcontextprotocol/server-sequential-thinking@latest"

# Playwright MCP
echo ""
echo "3. Playwright MCP (Browser Automation)"
echo "   Web automation and E2E testing support"
add_mcp_server "playwright" "@playwright/mcp@latest"

# GitHub MCP (optional - requires token)
echo ""
echo "4. GitHub MCP (Repository Operations)"
if [ -n "$GITHUB_TOKEN" ]; then
    echo "   GITHUB_TOKEN detected, adding GitHub MCP..."
    add_mcp_server "github" "@modelcontextprotocol/server-github"
else
    echo "   Skipping: GITHUB_TOKEN not set"
    echo "   To add later: export GITHUB_TOKEN=your_token && claude mcp add github -- npx -y @modelcontextprotocol/server-github"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Verify with: claude mcp list"
echo ""
echo "Usage examples:"
echo "  - 'Create a React component. use context7'"
echo "  - 'Help me debug this issue step by step'"
echo "  - 'Run E2E tests with Playwright'"
echo ""
echo "See docs/MCP_SETUP.md for more details."
