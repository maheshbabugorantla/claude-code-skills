# claude-code-skills

Four Claude Code skills — AWS & GCP architecture illustrations, crayon-style diagrams, and 12-act technical storyboards — installable in one command.

## Install

```bash
npx claude-code-skills@latest --global
```

Restart Claude Code after installing. All four skills appear in `/help`.

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| `aws-illustration` | `/aws-illustration` | Generates a Gemini AI image prompt + draw.io XML using `mxgraph.aws4` stencils. Dual light/dark themes, 10 illustration types, full 2023 AWS service-category palette. |
| `gcp-illustration` | `/gcp-illustration` | Generates a Gemini AI image prompt + draw.io XML using `mxgraph.gcp2` stencils. Material design aesthetic, Google Cloud core color palette. |
| `crayon-illustration` | `/crayon-illustration` | Generates a hand-drawn crayon-style illustration prompt for Gemini, DALL-E, or Midjourney. 7 layout types for technical concepts. |
| `technical-storybook` | `/technical-storybook` | Designs 12-act narrative storyboards that teach technical concepts through contrastive argumentation. Pairs with `/crayon-illustration` for per-act visuals. |

## Requirements

- **Node.js ≥ 20** (installer only — not needed at runtime)
- **`jq`** — required by `aws-illustration` and `gcp-illustration` service-lookup scripts

  ```bash
  brew install jq           # macOS
  sudo apt-get install jq   # Ubuntu / Debian
  ```

## Install specific skills

```bash
npx claude-code-skills@latest --global aws-illustration
npx claude-code-skills@latest --global aws-illustration gcp-illustration
npx claude-code-skills@latest --list
```

## Update

Same command — always pulls the latest:

```bash
npx claude-code-skills@latest --global
```

## Uninstall

```bash
npx claude-code-skills --uninstall --global
npx claude-code-skills --uninstall --global aws-illustration
```

## CLI reference

```
npx claude-code-skills [skill...] [options]

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
