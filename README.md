# mbg-claude-code-skills

Five Claude Code skills — AWS & GCP architecture illustrations, crayon-style diagrams, 12-act technical storyboards, and code-rendered playable statecharts — installable in one command.

## Install

```bash
npx mbg-claude-code-skills@latest --global
```

Restart Claude Code after installing. All five skills appear in `/help`.

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| `aws-illustration` | `/aws-illustration` | Generates a Gemini AI image prompt + draw.io XML using `mxgraph.aws4` stencils. Dual light/dark themes, 10 illustration types, full 2023 AWS service-category palette. |
| `gcp-illustration` | `/gcp-illustration` | Generates a Gemini AI image prompt + draw.io XML using `mxgraph.gcp2` stencils. Material design aesthetic, Google Cloud core color palette. |
| `crayon-illustration` | `/crayon-illustration` | Generates a hand-drawn crayon-style illustration prompt for Gemini, DALL-E, or Midjourney. 7 layout types for technical concepts. |
| `technical-storybook` | `/technical-storybook` | Designs 12-act narrative storyboards that teach technical concepts through contrastive argumentation. Pairs with `/crayon-illustration` for per-act visuals. |
| `playable-statechart` | `/playable-statechart` | Draws a statechart by code (ELK layout + rough.js, crayon palette) as a tap-to-play single-file HTML and a 1920×1080 PNG. Consumes pstack `/statechart` output (TLA+ → TLC → Mermaid + report) and replays the bug path; hand-written charts render with a "sketch, not checked" mark. Acts with `Visual type: statechart` in a storyboard route here. |

## Requirements

- **Node.js ≥ 20** (installer only — not needed at runtime)
- **`jq`** — required by `aws-illustration` and `gcp-illustration` service-lookup scripts
- **Node.js ≥ 22.18** at runtime for `playable-statechart` only (its scripts are TypeScript run directly). First render runs `npm install` inside the skill's `scripts/`; `--png` additionally needs Playwright with Chromium.

  ```bash
  brew install jq           # macOS
  sudo apt-get install jq   # Ubuntu / Debian
  ```

## Install specific skills

```bash
npx mbg-claude-code-skills@latest --global aws-illustration
npx mbg-claude-code-skills@latest --global aws-illustration gcp-illustration
npx mbg-claude-code-skills@latest --list
```

## Update

Same command — always pulls the latest:

```bash
npx mbg-claude-code-skills@latest --global
```

## Uninstall

```bash
npx mbg-claude-code-skills --uninstall --global
npx mbg-claude-code-skills --uninstall --global aws-illustration
```

## CLI reference

```
npx mbg-claude-code-skills [skill...] [options]

Arguments:
  skill                 One or more skill names to install (default: all)

Options:
  --global, -g          Install to ~/.claude/skills/  (default when non-interactive)
  --local, -l           Install to ./.claude/skills/  (current project only)
  --list                List all available skills
  --uninstall, -u       Remove installed skills
  --force, -f           Skip confirmation prompt (for --uninstall)
  --prefix              Install as /mb-aws-illustration etc. (avoids name collisions
                        when running multiple skill packs)
  --no-prefix           Short names — default
  --config-dir <path>   Override Claude config directory
                        (also honours $CLAUDE_CONFIG_DIR env var)
```

## License

MIT
