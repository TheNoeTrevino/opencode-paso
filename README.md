# opencode-paso-session

OpenCode plugin for [paso](https://github.com/thenoetrevino/paso) workflow context injection.

Dynamically runs `paso tutorial` at session start, ensuring AI agents always have up-to-date paso command reference.

## Requirements

- `paso` must be installed and in your PATH

## Installation

```bash
bun add opencode-paso-session
```

Or use `paso setup opencode` to auto-configure.

## Manual Configuration

Add to your `opencode.json`:

```json
{
  "plugin": ["opencode-paso-session"]
}
```

## What It Does

On every new OpenCode session, this plugin:
1. Runs `paso tutorial` to get current workflow context
2. Injects the output into the session (without triggering AI response)

This provides the AI with:
- Core workflow rules
- Essential CLI commands (projects, tasks, dependencies)
- Common workflow patterns
- Output flag reference

## License

MIT
