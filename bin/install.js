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
const SKILLS       = ['aws-illustration', 'crayon-illustration', 'technical-storybook'];
const MANIFEST     = '.cc-skills-manifest.json';
const PATCHES_DIR  = 'cc-skills-patches';
const SKIP_FILES   = new Set(['.npmignore', '.DS_Store']);

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

const argv        = process.argv.slice(2);
const has         = (...flags) => flags.some(f => argv.includes(f));
const hasGlobal   = has('--global', '-g');
const hasLocal    = has('--local',  '-l');
const hasUninstall = has('--uninstall', '-u');
const hasForce    = has('--force',  '-f');
const usePrefix   = has('--prefix') && !has('--no-prefix');

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

function installName(skill) {
  return usePrefix ? `mb-${skill}` : skill;
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
    for (const f of walkFiles(path.join(skillsDir, name))) {
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

function checkDeps() {
  if (!hasBin('jq')) {
    const hint = process.platform === 'darwin'
      ? 'brew install jq'
      : 'sudo apt-get install jq  # or: sudo yum install jq';
    console.log(`\n${yellow}⚠  aws-illustration requires jq (not found in PATH)${reset}`);
    console.log(`   Install: ${dim}${hint}${reset}`);
  }
}

// ─── install ─────────────────────────────────────────────────────────────────

function install(isGlobal) {
  const configDir = resolveTarget(isGlobal);
  const skillsDir = path.join(configDir, 'skills');
  const pkgDir    = path.join(__dirname, '..');

  console.log(`\n${bold}cc-skills${reset} ${dim}v${PKG.version}${reset}\n`);
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
  for (const skill of SKILLS) {
    const name = installName(skill);
    const dest = path.join(skillsDir, name);
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    copyDir(path.join(pkgDir, skill), dest);
    installed.push(name);
    console.log(`  ${green}✓${reset}  /${name}`);
  }

  writeManifest(configDir, skillsDir, installed);
  checkDeps();

  console.log(`\n  ${green}${installed.length} skills installed.${reset} Restart Claude Code, then run ${cyan}/help${reset}.\n`);
  console.log(`  ${dim}Update:    npx @maheshbabugorantla/cc-skills@latest${isGlobal ? ' --global' : ' --local'}`);
  console.log(`  Uninstall: npx @maheshbabugorantla/cc-skills --uninstall${isGlobal ? ' --global' : ''}${reset}\n`);
}

// ─── uninstall ───────────────────────────────────────────────────────────────

function uninstall(isGlobal) {
  const configDir = resolveTarget(isGlobal);
  const skillsDir = path.join(configDir, 'skills');
  const manifestP = path.join(configDir, MANIFEST);
  const patchDir  = path.join(configDir, PATCHES_DIR);

  const skillDirs = [];
  if (fs.existsSync(skillsDir)) {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const n = entry.name;
      if (SKILLS.includes(n) || SKILLS.some(s => n === `mb-${s}`)) {
        skillDirs.push(path.join(skillsDir, n));
      }
    }
  }

  if (!skillDirs.length && !fs.existsSync(manifestP)) {
    console.log(`\n${yellow}Nothing from cc-skills found in ${configDir}${reset}\n`);
    return;
  }

  console.log(`\n${bold}Uninstall cc-skills${reset} from ${dim}${configDir}${reset}\n`);
  for (const p of skillDirs)           console.log(`  ${dim}remove  skills/${path.basename(p)}${reset}`);
  if (fs.existsSync(manifestP))        console.log(`  ${dim}remove  ${MANIFEST}${reset}`);
  if (fs.existsSync(patchDir))         console.log(`  ${dim}remove  ${PATCHES_DIR}/${reset}`);

  function doRemove() {
    for (const p of skillDirs) fs.rmSync(p, { recursive: true, force: true });
    if (fs.existsSync(manifestP)) fs.rmSync(manifestP);
    if (fs.existsSync(patchDir))  fs.rmSync(patchDir, { recursive: true, force: true });
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

// ─── interactive location prompt ─────────────────────────────────────────────

function promptLocation() {
  console.log(`\n${bold}cc-skills${reset} ${dim}v${PKG.version}${reset}\n`);
  console.log(`  ${cyan}1${reset}  Global  ${dim}~/.claude/skills/${reset}  ${dim}(recommended)${reset}`);
  console.log(`  ${cyan}2${reset}  Local   ${dim}./.claude/skills/${reset}  ${dim}(this project only)${reset}\n`);
  const iface = rl.createInterface({ input: process.stdin, output: process.stdout });
  iface.question(`  Choice ${dim}[1]${reset}: `, ans => {
    iface.close();
    install(ans.trim() !== '2');
  });
}

// ─── main ────────────────────────────────────────────────────────────────────

if (hasGlobal && hasLocal) {
  console.error(`\n${red}✗  --global and --local are mutually exclusive${reset}\n`);
  process.exit(1);
}

if (hasUninstall) {
  uninstall(hasGlobal || !hasLocal);
} else if (hasGlobal || hasLocal) {
  install(hasGlobal);
} else if (!process.stdin.isTTY) {
  install(true); // non-interactive (CI / pipe): default to global
} else {
  promptLocation();
}
