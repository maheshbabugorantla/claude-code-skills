#!/usr/bin/env node
'use strict';

const fs      = require('fs');
const path    = require('path');
const os      = require('os');
const rl      = require('readline');
const crypto  = require('crypto');
const { execSync } = require('child_process');

// ─── config ──────────────────────────────────────────────────────────────────

const PKG          = require('../package.json');
const MANIFEST     = '.cc-skills-manifest.json';
const PATCHES_DIR  = 'cc-skills-patches';
const SKIP_FILES   = new Set(['.npmignore', '.DS_Store']);

const SKILLS = [
  { id: 'aws-illustration',    desc: 'AWS architecture diagrams (mxgraph.aws4, light/dark)' },
  { id: 'gcp-illustration',    desc: 'Google Cloud diagrams (mxgraph.gcp2, light/dark)' },
  { id: 'crayon-illustration', desc: 'Hand-drawn style illustration prompts (7 layout types)' },
  { id: 'technical-storybook', desc: '12-act narrative storyboards for technical concepts' },
];

const SKILL_IDS = SKILLS.map(s => s.id);

// ─── colors ──────────────────────────────────────────────────────────────────

const tty    = Boolean(process.stdout.isTTY);
const cyan   = tty ? '\x1b[36m' : '';
const green  = tty ? '\x1b[32m' : '';
const yellow = tty ? '\x1b[33m' : '';
const red    = tty ? '\x1b[31m' : '';
const bold   = tty ? '\x1b[1m'  : '';
const dim    = tty ? '\x1b[2m'  : '';
const reset  = tty ? '\x1b[0m'  : '';

// ─── arg parsing ─────────────────────────────────────────────────────────────

const argv         = process.argv.slice(2);
const has          = (...flags) => flags.some(f => argv.includes(f));
const hasGlobal    = has('--global', '-g');
const hasLocal     = has('--local',  '-l');
const hasUninstall = has('--uninstall', '-u');
const hasForce     = has('--force',  '-f');
const hasList      = has('--list');
const usePrefix    = has('--prefix') && !has('--no-prefix');

// positional args = anything not starting with '-' that is a known skill id
const positionalSkills = argv.filter(a => !a.startsWith('-') && SKILL_IDS.includes(a));

// unknown positional args (user typos or unsupported names)
const unknownArgs = argv.filter(a => !a.startsWith('-') && !SKILL_IDS.includes(a));

function argValue(flag) {
  const i = argv.indexOf(flag);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('-')) return argv[i + 1];
  const eq = argv.find(a => a.startsWith(`${flag}=`));
  return eq ? eq.slice(flag.length + 1) : null;
}

const explicitDir = argValue('--config-dir');

// ─── path resolution ─────────────────────────────────────────────────────────

function expandTilde(p) {
  if (!p) return p;
  return (p === '~' || p.startsWith('~/')) ? path.join(os.homedir(), p.slice(1)) : p;
}

function resolveTarget(isGlobal) {
  if (explicitDir) return expandTilde(explicitDir);
  if (isGlobal) {
    return process.env.CLAUDE_CONFIG_DIR
      ? expandTilde(process.env.CLAUDE_CONFIG_DIR)
      : path.join(os.homedir(), '.claude');
  }
  return path.join(process.cwd(), '.claude');
}

function installName(skillId) {
  return usePrefix ? `mb-${skillId}` : skillId;
}

// ─── fs helpers ──────────────────────────────────────────────────────────────

function sha16(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').slice(0, 16);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP_FILES.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to   = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
      const mode = fs.statSync(from).mode;
      if (mode & 0o111) fs.chmodSync(to, mode); // preserve executable bit
    }
  }
}

function walkFiles(dir, prefix) {
  prefix = prefix || '';
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push.apply(out, walkFiles(abs, rel));
    else out.push({ abs, rel });
  }
  return out;
}

function atomicWrite(filePath, content) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, content, 'utf8');
  fs.renameSync(tmp, filePath);
}

// ─── manifest ────────────────────────────────────────────────────────────────

function readManifest(configDir) {
  const p = path.join(configDir, MANIFEST);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function writeManifest(configDir, skillsDir, names) {
  const files = {};
  for (const name of names) {
    const skillDir = path.join(skillsDir, name);
    if (!fs.existsSync(skillDir)) continue;
    for (const f of walkFiles(skillDir)) {
      files[`skills/${name}/${f.rel}`] = sha16(f.abs);
    }
  }
  atomicWrite(
    path.join(configDir, MANIFEST),
    JSON.stringify({ version: PKG.version, installedAt: new Date().toISOString(), files }, null, 2) + '\n'
  );
}

function savePatches(configDir, manifest) {
  if (!manifest) return [];
  const modified = [];
  const patchDir = path.join(configDir, PATCHES_DIR);
  for (const rel of Object.keys(manifest.files || {})) {
    const abs = path.join(configDir, rel);
    if (!fs.existsSync(abs) || sha16(abs) === manifest.files[rel]) continue;
    const dest = path.join(patchDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    modified.push(rel);
  }
  if (modified.length) {
    atomicWrite(
      path.join(patchDir, 'backup-meta.json'),
      JSON.stringify({
        previousVersion: manifest.version,
        backedUpAt: new Date().toISOString(),
        files: modified,
      }, null, 2) + '\n'
    );
  }
  return modified;
}

// ─── dependency checks ───────────────────────────────────────────────────────

function hasBin(cmd) {
  try { execSync(`which ${cmd}`, { stdio: 'ignore' }); return true; } catch { return false; }
}

function checkDeps(selectedSkillIds) {
  const needsJq = selectedSkillIds.some(id => id === 'aws-illustration' || id === 'gcp-illustration');
  if (needsJq && !hasBin('jq')) {
    const hint = process.platform === 'darwin'
      ? 'brew install jq'
      : 'sudo apt-get install jq  # or: sudo yum install jq';
    console.log(`\n${yellow}⚠  aws-illustration / gcp-illustration require jq (not found in PATH)${reset}`);
    console.log(`   Install: ${dim}${hint}${reset}`);
  }
}

// ─── list ─────────────────────────────────────────────────────────────────────

function listSkills() {
  console.log(`\n${bold}Available skills${reset} ${dim}(${PKG.name} v${PKG.version})${reset}\n`);
  SKILLS.forEach((s, i) => {
    console.log(`  ${cyan}${i + 1}${reset}  ${bold}${s.id}${reset}`);
    console.log(`     ${dim}${s.desc}${reset}`);
  });
  console.log(`\n${dim}Install all:     npx ${PKG.name}@latest --global`);
  console.log(`Install one:     npx ${PKG.name}@latest --global aws-illustration`);
  console.log(`Install subset:  npx ${PKG.name}@latest --global aws-illustration gcp-illustration${reset}\n`);
}

// ─── install ─────────────────────────────────────────────────────────────────

function install(isGlobal, skillIds) {
  skillIds = skillIds || SKILL_IDS;

  const configDir = resolveTarget(isGlobal);
  const skillsDir = path.join(configDir, 'skills');
  const pkgDir    = path.join(__dirname, '..');

  const scope = skillIds.length === SKILL_IDS.length ? 'all skills' : `${skillIds.length} skill(s)`;
  console.log(`\n${bold}cc-skills${reset} ${dim}v${PKG.version}${reset}  ${dim}— installing ${scope}${reset}\n`);
  console.log(`  ${dim}→ ${configDir}/skills/${reset}\n`);

  // on upgrade: detect user-modified files and back them up before wiping
  const manifest = readManifest(configDir);
  if (manifest && manifest.version !== PKG.version) {
    const modified = savePatches(configDir, manifest);
    if (modified.length) {
      console.log(`  ${yellow}↑ v${manifest.version} → v${PKG.version}: ${modified.length} local change(s) saved to ${PATCHES_DIR}/${reset}\n`);
    }
  }

  fs.mkdirSync(skillsDir, { recursive: true });

  const installed = [];
  for (const skillId of skillIds) {
    const srcDir = path.join(pkgDir, skillId);
    if (!fs.existsSync(srcDir)) {
      console.log(`  ${yellow}⚠  ${skillId} not found in package (skipped)${reset}`);
      continue;
    }
    const name = installName(skillId);
    const dest = path.join(skillsDir, name);
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    copyDir(srcDir, dest);
    installed.push(name);
    console.log(`  ${green}✓${reset}  /${name}`);
  }

  // merge with existing manifest so previously installed skills aren't forgotten
  const existingManifest = readManifest(configDir);
  const existingNames = existingManifest
    ? Object.keys(existingManifest.files || {})
        .map(k => k.split('/')[1])
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(n => fs.existsSync(path.join(skillsDir, n)))
    : [];
  const allTracked = [...new Set([...existingNames, ...installed])];
  writeManifest(configDir, skillsDir, allTracked);

  checkDeps(skillIds);

  const suffix = isGlobal ? ' --global' : ' --local';
  console.log(`\n  ${green}${installed.length} skill(s) installed.${reset} Restart Claude Code, then run ${cyan}/help${reset}.\n`);
  console.log(`  ${dim}Add more:  npx ${PKG.name}@latest${suffix} <skill-name>`);
  console.log(`  Update:    npx ${PKG.name}@latest${suffix}`);
  console.log(`  List:      npx ${PKG.name}@latest --list`);
  console.log(`  Uninstall: npx ${PKG.name} --uninstall${suffix}${reset}\n`);
}

// ─── uninstall ───────────────────────────────────────────────────────────────

function uninstall(isGlobal, skillIds) {
  const configDir = resolveTarget(isGlobal);
  const skillsDir = path.join(configDir, 'skills');
  const manifestP = path.join(configDir, MANIFEST);
  const patchDir  = path.join(configDir, PATCHES_DIR);

  // if skillIds specified, only remove those; otherwise remove all known
  const targetIds = skillIds && skillIds.length > 0 ? skillIds : SKILL_IDS;

  const skillDirs = [];
  if (fs.existsSync(skillsDir)) {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const n = entry.name;
      if (targetIds.includes(n) || targetIds.some(id => n === `mb-${id}`)) {
        skillDirs.push(path.join(skillsDir, n));
      }
    }
  }

  const removingAll = targetIds.length === SKILL_IDS.length || targetIds.every(id => SKILL_IDS.includes(id)) && targetIds.length === SKILL_IDS.length;

  if (!skillDirs.length && !(removingAll && fs.existsSync(manifestP))) {
    console.log(`\n${yellow}Nothing matching [${targetIds.join(', ')}] found in ${configDir}${reset}\n`);
    return;
  }

  console.log(`\n${bold}Uninstall cc-skills${reset} from ${dim}${configDir}${reset}\n`);
  for (const p of skillDirs) console.log(`  ${dim}remove  skills/${path.basename(p)}${reset}`);
  if (removingAll && fs.existsSync(manifestP))  console.log(`  ${dim}remove  ${MANIFEST}${reset}`);
  if (removingAll && fs.existsSync(patchDir))   console.log(`  ${dim}remove  ${PATCHES_DIR}/${reset}`);

  function doRemove() {
    for (const p of skillDirs) fs.rmSync(p, { recursive: true, force: true });
    if (removingAll) {
      if (fs.existsSync(manifestP)) fs.rmSync(manifestP);
      if (fs.existsSync(patchDir))  fs.rmSync(patchDir, { recursive: true, force: true });
    } else {
      // update manifest to remove only the uninstalled skills
      const manifest = readManifest(configDir);
      if (manifest) {
        const removedNames = skillDirs.map(p => path.basename(p));
        const remaining = Object.fromEntries(
          Object.entries(manifest.files || {}).filter(([k]) => !removedNames.some(n => k.startsWith(`skills/${n}/`)))
        );
        atomicWrite(manifestP, JSON.stringify({ ...manifest, files: remaining }, null, 2) + '\n');
      }
    }
    console.log(`\n  ${green}✓ Uninstalled.${reset} Restart Claude Code.\n`);
  }

  if (hasForce) { doRemove(); return; }

  const iface = rl.createInterface({ input: process.stdin, output: process.stdout });
  iface.question(`\n  Continue? ${dim}[y/N]${reset} `, ans => {
    iface.close();
    if (['y', 'Y', 'yes'].includes(ans.trim())) doRemove();
    else console.log('\n  Aborted.\n');
  });
}

// ─── interactive prompts ──────────────────────────────────────────────────────

function parseSkillSelection(input) {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed || trimmed === 'all' || trimmed === 'a') return SKILL_IDS;

  // accept space or comma-separated numbers or skill names
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  const selected = [];
  const invalid = [];

  for (const t of tokens) {
    const num = parseInt(t, 10);
    if (!isNaN(num) && num >= 1 && num <= SKILLS.length) {
      selected.push(SKILLS[num - 1].id);
    } else if (SKILL_IDS.includes(t)) {
      selected.push(t);
    } else {
      invalid.push(t);
    }
  }

  if (invalid.length) {
    console.log(`\n  ${yellow}Unknown: ${invalid.join(', ')}. Valid: ${SKILL_IDS.join(', ')}${reset}`);
    return null; // signal re-prompt
  }
  return [...new Set(selected)];
}

function promptSkills(callback) {
  console.log(`\n  ${bold}Available skills:${reset}\n`);
  SKILLS.forEach((s, i) => {
    console.log(`  ${cyan}${i + 1}${reset}  ${bold}${s.id}${reset}  ${dim}— ${s.desc}${reset}`);
  });
  console.log();

  const iface = rl.createInterface({ input: process.stdin, output: process.stdout });

  function ask() {
    iface.question(`  Install ${dim}[all]${reset} or enter numbers/names (e.g. ${dim}1 2${reset} or ${dim}aws-illustration${reset}): `, ans => {
      const result = parseSkillSelection(ans);
      if (result === null) { ask(); return; } // invalid input — re-ask
      iface.close();
      callback(result);
    });
  }
  ask();
}

function promptLocation(skillIds) {
  console.log(`\n${bold}cc-skills${reset} ${dim}v${PKG.version}${reset}\n`);
  console.log(`  ${cyan}1${reset}  Global  ${dim}~/.claude/skills/${reset}  ${dim}(all projects — recommended)${reset}`);
  console.log(`  ${cyan}2${reset}  Local   ${dim}./.claude/skills/${reset}  ${dim}(this project only)${reset}\n`);

  const iface = rl.createInterface({ input: process.stdin, output: process.stdout });
  iface.question(`  Location ${dim}[1]${reset}: `, ans => {
    iface.close();
    const isGlobal = ans.trim() !== '2';
    if (skillIds) {
      install(isGlobal, skillIds);
    } else {
      promptSkills(selected => install(isGlobal, selected));
    }
  });
}

// ─── main ────────────────────────────────────────────────────────────────────

if (unknownArgs.length) {
  console.error(`\n${red}✗  Unknown skill(s): ${unknownArgs.join(', ')}${reset}`);
  console.error(`   Available: ${SKILL_IDS.join(', ')}`);
  console.error(`   Run ${dim}npx ${PKG.name} --list${reset} to see all skills.\n`);
  process.exit(1);
}

if (hasGlobal && hasLocal) {
  console.error(`\n${red}✗  --global and --local are mutually exclusive${reset}\n`);
  process.exit(1);
}

if (hasList) {
  listSkills();
} else if (hasUninstall) {
  uninstall(hasGlobal || !hasLocal, positionalSkills.length ? positionalSkills : null);
} else if (hasGlobal || hasLocal) {
  // non-interactive: install specified skills (or all if none specified)
  install(hasGlobal, positionalSkills.length ? positionalSkills : SKILL_IDS);
} else if (!process.stdin.isTTY) {
  // non-interactive (CI / pipe): install all by default
  install(true, SKILL_IDS);
} else {
  // interactive: prompt location, then skills (unless already specified)
  promptLocation(positionalSkills.length ? positionalSkills : null);
}
