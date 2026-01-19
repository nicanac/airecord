---
description: Run Ralph autonomous coding loop with Antigravity
---

## Overview

Ralph is an autonomous AI coding loop that processes tasks from `TASKS.md` (or PRD.md) and implements them one at a time, committing after each completion.

## Quick Start

```bash
# Run with defaults (parallel, TASKS.md)
./ralphy.sh

# Single task mode
./ralphy.sh "add footer component"

# Sequential mode (one task at a time)
./ralphy.sh --no-parallel
```

## Prerequisites

1. Ensure task file exists: `memory-bank/TASKS.md`
2. Ensure Claude CLI is installed: `claude --version`
3. Ensure you're in a git repository

## Steps

### 1. Verify Setup
// turbo
```bash
# Check if ralphy.sh exists and is executable
ls -la ralphy.sh
```

### 2. Check TASKS.md
// turbo
```bash
# Count pending tasks
grep -c '\[ \]' memory-bank/TASKS.md 2>/dev/null || echo "TASKS.md not found"
```

### 3. Run Ralph

For parallel mode (default - 3 concurrent tasks):
```bash
./ralphy.sh
```

For sequential mode:
```bash
./ralphy.sh --no-parallel
```

### 4. Monitor Progress

Ralph will:
- Pick up uncompleted `[ ]` tasks
- Mark them as `[/]` when in progress
- Mark them as `[x]` when completed
- Auto-commit with conventional commit format
- Continue until all tasks complete or errors occur

## Configuration Options

| Flag | Description |
|------|-------------|
| `--no-parallel` | Run tasks sequentially |
| `--max-parallel N` | Set max concurrent tasks (default: 3) |
| `--branch-per-task` | Create git branch per task |
| `--create-pr` | Create PRs for each branch |
| `--fast` | Skip tests and lint |
| `--dry-run` | Preview without executing |

## Task Format

```markdown
# memory-bank/TASKS.md

## Phase 1: Setup
- [ ] Initialize project structure
- [ ] Add authentication

## Phase 2: Features  
- [ ] Create dashboard component
- [ ] Add user profile page

## Completed
- [x] Project scaffolding
```

## Troubleshooting

**No tasks found:**
- Ensure `memory-bank/TASKS.md` exists
- Use `--prd PRD.md` for traditional PRD files

**Permission denied:**
```bash
chmod +x ralphy.sh
```

**Claude CLI not found:**
```bash
npm install -g @anthropic-ai/claude-code
```

## Integration with Notion

To sync tasks with Notion (experimental):
```bash
./ralphy.sh --use-notion
```

## Related

- `/setup-ralph` - Initialize Ralph in a new project
- `/commit-fast-conventional` - Quick conventional commits
