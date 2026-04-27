# cc-skills

Three Claude Code skills — AWS architecture illustrations, crayon-style diagrams, and 12-act technical storyboards — installable in one command.

## Install

```bash
npx @maheshbabugorantla/cc-skills@latest --global
```

Restart Claude Code after installing. All three skills appear in `/help`.

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| `aws-illustration` | `/aws-illustration` | Generates a Gemini AI image prompt + draw.io XML using `mxgraph.aws4` stencils. Dual light/dark themes, 10 illustration types, full 2023 AWS service-category palette. |
| `crayon-illustration` | `/crayon-illustration` | Generates a hand-drawn crayon-style illustration prompt for Gemini, DALL-E, or Midjourney. 7 layout types for technical concepts. |
| `technical-storybook` | `/technical-storybook` | Designs 12-act narrative storyboards that teach technical concepts through contrastive argumentation. Pairs with `/crayon-illustration` for per-act visuals. |

## Requirements

- **Node.js ≥ 20** (installer only — not needed at runtime)
- **`jq`** — required by `aws-illustration`'s service-lookup script

  ```bash
  brew install jq           # macOS
  sudo apt-get install jq   # Ubuntu / Debian
  ```

## Update

Same command — always pulls the latest:

```bash
npx @maheshbabugorantla/cc-skills@latest --global
```

## Uninstall

```bash
npx @maheshbabugorantla/cc-skills --uninstall --global
```

## CLI reference

```
npx @maheshbabugorantla/cc-skills [options]

Options:
  --global, -g          Install to ~/.claude/skills/  (default when non-interactive)
  --local, -l           Install to ./.claude/skills/  (current project only)
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
