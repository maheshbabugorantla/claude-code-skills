# mbg-claude-code-skills

Six agent skills — AWS & GCP architecture illustrations, crayon-style diagrams, 12-act technical storyboards, and stepped isometric explainers — installable in one command. Written for Claude Code; the two isometric skills also run in Codex CLI and Gemini CLI.

## Install

```bash
npx mbg-claude-code-skills@latest --global
```

Restart Claude Code after installing. All six skills appear in `/help`.

For Codex CLI and Gemini CLI, which both read skills from `~/.agents/skills/`:

```bash
npx mbg-claude-code-skills@latest --global --agents isometric-illustration technical-explainer
```

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| `aws-illustration` | `/aws-illustration` | Generates a Gemini AI image prompt + draw.io XML using `mxgraph.aws4` stencils. Dual light/dark themes, 10 illustration types, full 2023 AWS service-category palette. |
| `gcp-illustration` | `/gcp-illustration` | Generates a Gemini AI image prompt + draw.io XML using `mxgraph.gcp2` stencils. Material design aesthetic, Google Cloud core color palette. |
| `crayon-illustration` | `/crayon-illustration` | Generates a hand-drawn crayon-style illustration prompt for Gemini, DALL-E, or Midjourney. 7 layout types for technical concepts. |
| `technical-storybook` | `/technical-storybook` | Designs 12-act narrative storyboards that teach technical concepts through contrastive argumentation. Pairs with `/crayon-illustration` for per-act visuals. |
| `technical-explainer` | `/technical-explainer` | Scripts a stepped explainer: a cast, a few gauges, and 6 to 12 steps that each change one thing on one persistent diagram. Pairs with `/isometric-illustration`. |
| `isometric-illustration` | `/isometric-illustration` | Draws a system as an isometric SVG scene with a bundled engine: a still, a frame per step, or a self-contained lesson page with a step player. Three themes. Optional cover image through Nano Banana Pro. |

## Requirements

- **Node.js ≥ 20** (installer only — not needed at runtime)
- **Node.js ≥ 18 at runtime** for `isometric-illustration` only: its engine is JavaScript with no dependencies
- **`jq`** — required by `aws-illustration` and `gcp-illustration` service-lookup scripts

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
  --agents              Install to ~/.agents/skills/ (or ./.agents/skills/ with --local),
                        the directory Codex CLI and Gemini CLI read
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
