#!/usr/bin/env node
// scripts/plugins/chatgpt-zip.mjs: build the ZIP that OpenAI's plugin directory takes
// (platform.openai.com/plugins → Upload new or existing plugin → With MCP).
//
// The same file ships in ahsuite-mcp, worksafe1 (Jobsite) and mise (Excellent). If you change it,
// change all three.
//
// Each plugin has a source folder, mcp/chatgpt/<slug>/:
//   plugin.json       the Agent Plugins manifest, shipped as written. extensions["com.openai"] holds
//                     the listing (interface), the review packet (5 positive + 3 negative test cases,
//                     commerce, demo_recording_url) and publication.release_notes, so the upload
//                     form fills itself.
//   mcp.json          the Agent Plugins MCP config, shipped as written.
//   build.json        build inputs. All paths are relative to the repo root:
//                       skills:        the Claude plugin's skills folder, copied in (optional)
//                       replace:       [[from, to], …] applied to every skill file, e.g. Claude→ChatGPT
//                       skillAddendum: a file in this folder appended to every SKILL.md (optional)
//                       files:         { "<path in the ZIP>": "<source path>" } for assets and LICENSE
//   anything else build.json names, such as composer-icon.png
//
// It also generates two files older clients read: .mcp.json (type http) and .codex-plugin/plugin.json.
//
// Checks, from what OpenAI's form enforces and what the reviewed Ahsuite submission taught us:
// - The 30-character display name and short description, and the 4,000-character long description.
// - At most three default prompts, each 128 characters or fewer, and a category from OpenAI's list.
// - https policy URLs, and a brand color with 2:1 contrast against white.
// - Square PNG icons that are actually in the ZIP.
// - Exactly 5 positive and 3 negative review cases. Expected answers use no run-date-relative words:
//   reviewers run them days later.
// - Every SKILL.md names its own folder. No skill relies on Claude Code (its name or a slash
//   command such as /mcp), and no "Claude" survives the rewording.
// The demo video URL is reported as owed; --strict makes a missing one fail.
//
//   node scripts/plugins/chatgpt-zip.mjs                 build every plugin into dist/chatgpt/
//   node scripts/plugins/chatgpt-zip.mjs jobsite         build one
//   node scripts/plugins/chatgpt-zip.mjs --check         validate only, write nothing (CI)
//   node scripts/plugins/chatgpt-zip.mjs --strict        also fail on anything still owed
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SOURCE_DIR = join("mcp", "chatgpt");

const PLUGIN_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const MCP_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
export const CATEGORIES = [
  "Productivity", "Creativity", "Developer Tools", "Business & Operations", "Data & Analytics",
  "Communication", "Education & Research", "Security", "Finance", "Healthcare", "Travel",
  "Entertainment",
];
const NAME_RE = /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const RELATIVE_DATE_RE =
  /\b(today|tonight|tomorrow|yesterday|this (?:week|month)|next (?:week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|last (?:week|month))\b/i;

// Claude Code mechanics a skill can't rely on in ChatGPT: the product name, its slash commands.
const CLAUDE_CODE_RE = /Claude Code|(?<![\w/])\/(?:mcp|plugin|skills?)\b/;

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const https = (u) => typeof u === "string" && /^https:\/\/[^\s]+$/.test(u);

/** Every plugin source folder under mcp/chatgpt/. */
export function listPlugins(repo = REPO) {
  const dir = join(repo, SOURCE_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => existsSync(join(dir, n, "plugin.json"))).sort();
}

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Width and height of a PNG, or null when the bytes are not a PNG. */
export function pngSize(buf) {
  const sig = "89504e470d0a1a0a";
  if (buf.length < 24 || buf.subarray(0, 8).toString("hex") !== sig) return null;
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

function contrastAgainstWhite(hex) {
  const lin = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  return 1.05 / (lum + 0.05);
}

/**
 * Assemble one plugin in memory. Returns { name, version, files: Map<zipPath, Buffer>, errors, owed }.
 * Nothing is written.
 */
export function buildPlugin(slug, repo = REPO) {
  const src = join(repo, SOURCE_DIR, slug);
  const errors = [];
  const owed = [];
  const files = new Map();
  const err = (m) => errors.push(`${slug}: ${m}`);

  const manifestText = readFileSync(join(src, "plugin.json"));
  const mcpText = readFileSync(join(src, "mcp.json"));
  const manifest = JSON.parse(manifestText);
  const mcp = JSON.parse(mcpText);
  const build = existsSync(join(src, "build.json")) ? readJson(join(src, "build.json")) : {};
  files.set("plugin.json", manifestText);
  files.set("mcp.json", mcpText);

  // Manifest identity (the Agent Plugins schema: $schema + name required, nothing unknown at the top).
  const TOP = ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"];
  if (manifest.$schema !== PLUGIN_SCHEMA) err(`plugin.json $schema must be ${PLUGIN_SCHEMA}`);
  for (const k of Object.keys(manifest)) if (!TOP.includes(k)) err(`plugin.json has unknown top-level field "${k}"`);
  if (manifest.name !== slug) err(`plugin.json name "${manifest.name}" must equal its folder "${slug}"`);
  if (!NAME_RE.test(manifest.name ?? "") || manifest.name.length > 64) err("plugin.json name must be lowercase a-z, 0-9, . and -");
  if (!SEMVER_RE.test(manifest.version ?? "")) err("plugin.json version must be semver (x.y.z)");
  if (!manifest.description?.trim()) err("plugin.json description is empty");
  if (!manifest.author?.name?.trim()) err("plugin.json author.name is empty");

  const openai = manifest.extensions?.["com.openai"] ?? {};
  const ui = openai.interface ?? {};
  const review = openai.review ?? {};

  // Listing (interface).
  const limits = { displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 100 };
  for (const [k, max] of Object.entries(limits)) {
    if (typeof ui[k] !== "string" || !ui[k].trim()) err(`interface.${k} is empty`);
    else if (ui[k].length > max) err(`interface.${k} is ${ui[k].length} characters (max ${max})`);
  }
  if (!CATEGORIES.includes(ui.category)) err(`interface.category "${ui.category}" is not one of: ${CATEGORIES.join(", ")}`);
  if (!Array.isArray(ui.capabilities) || ui.capabilities.length === 0) err("interface.capabilities is empty");
  for (const k of ["websiteURL", "privacyPolicyURL", "termsOfServiceURL", "supportURL"]) {
    if (!https(ui[k])) err(`interface.${k} must be an https URL`);
  }
  const prompts = ui.defaultPrompt;
  if (!Array.isArray(prompts) || prompts.length < 1 || prompts.length > 3) err("interface.defaultPrompt must hold 1 to 3 prompts");
  else prompts.forEach((p, i) => { if (typeof p !== "string" || !p.trim() || p.length > 128) err(`interface.defaultPrompt[${i}] must be 1-128 characters (is ${p?.length})`); });
  if (ui.brandColor !== undefined) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(ui.brandColor)) err("interface.brandColor must be #RRGGBB");
    else if (contrastAgainstWhite(ui.brandColor) < 2) err("interface.brandColor needs at least 2:1 contrast against white");
  }

  // Review packet.
  const pos = review.test_cases?.positive;
  const neg = review.test_cases?.negative;
  if (!Array.isArray(pos) || pos.length !== 5) err(`review.test_cases.positive must hold exactly 5 cases (has ${pos?.length ?? 0})`);
  if (Array.isArray(pos)) pos.forEach((c, i) => {
    for (const k of ["description", "prompt", "tools_triggered", "expected_behavior"]) if (!c?.[k]?.trim?.()) err(`positive[${i}].${k} is empty`);
    if (RELATIVE_DATE_RE.test(c?.expected_behavior ?? "")) err(`positive[${i}].expected_behavior says "${c.expected_behavior.match(RELATIVE_DATE_RE)[0]}": reviewers run it on a later day, use an absolute date`);
  });
  if (!Array.isArray(neg) || neg.length !== 3) err(`review.test_cases.negative must hold exactly 3 cases (has ${neg?.length ?? 0})`);
  if (Array.isArray(neg)) neg.forEach((c, i) => { for (const k of ["description", "prompt"]) if (!c?.[k]?.trim?.()) err(`negative[${i}].${k} is empty`); });
  if (JSON.stringify(review.prompts) !== JSON.stringify(prompts)) err("review.prompts must equal interface.defaultPrompt");
  if (typeof review.commerce !== "boolean") err("review.commerce must be true or false");
  if (!review.commerce_description?.trim()) err("review.commerce_description is empty");
  if (!openai.publication?.release_notes?.trim()) err("publication.release_notes is empty");
  if (!https(review.demo_recording_url)) owed.push(`${slug}: review.demo_recording_url (a 60-90 s unlisted video of it working in ChatGPT)`);

  // MCP servers.
  const servers = Object.entries(mcp.mcpServers ?? {});
  if (mcp.$schema !== MCP_SCHEMA) err(`mcp.json $schema must be ${MCP_SCHEMA}`);
  if (servers.length === 0) err("mcp.json lists no server");
  for (const [name, s] of servers) {
    if (s.type !== "streamable-http") err(`mcp.json ${name}: type must be streamable-http`);
    if (!https(s.url)) err(`mcp.json ${name}: url must be https`);
    if (s.headers) err(`mcp.json ${name}: no headers (credentials never ship in the ZIP)`);
  }

  // Skills.
  let hasSkills = false;
  if (build.skills) {
    const skillsDir = join(repo, build.skills);
    const addendum = build.skillAddendum ? readFileSync(join(src, build.skillAddendum), "utf8") : null;
    for (const file of walk(skillsDir)) {
      const rel = relative(skillsDir, file).split(sep).join(posix.sep);
      let text = readFileSync(file, "utf8");
      const cc = text.match(CLAUDE_CODE_RE);
      if (cc) err(`skills/${rel} relies on Claude Code ("${cc[0]}"), which ChatGPT doesn't have`);
      for (const [from, to] of build.replace ?? []) text = text.split(from).join(to);
      if (rel.endsWith("/SKILL.md")) {
        hasSkills = true;
        if (addendum) text = `${text}\n${addendum}`;
        const folder = rel.split("/")[0];
        const fm = text.match(/^---\n([\s\S]*?)\n---/);
        const name = fm?.[1].match(/^name:\s*(.+)$/m)?.[1].trim();
        if (name !== folder) err(`skills/${rel}: frontmatter name "${name}" must equal its folder "${folder}"`);
        if (!fm?.[1].match(/^description:\s*\S/m)) err(`skills/${rel}: frontmatter description is empty`);
      }
      if (text.includes("Claude")) err(`skills/${rel} still says "Claude" (add ["Claude", "ChatGPT"] to build.json replace)`);
      files.set(`skills/${rel}`, Buffer.from(text));
    }
    if (!hasSkills) err(`build.json skills "${build.skills}" holds no SKILL.md`);
  }

  // Assets, LICENSE and anything else named in build.json.
  for (const [to, from] of Object.entries(build.files ?? {})) {
    const p = join(repo, from);
    if (!existsSync(p)) { err(`build.json files: ${from} does not exist`); continue; }
    files.set(to, readFileSync(p));
  }
  for (const k of ["composerIcon", "logo", "logoDark"]) {
    if (ui[k] === undefined) { if (k !== "logoDark") err(`interface.${k} is missing`); continue; }
    const at = posix.normalize(String(ui[k]).replace(/^\.\//, ""));
    const buf = files.get(at);
    if (!buf) { err(`interface.${k} points at ${ui[k]}, which is not in the ZIP (add it to build.json files)`); continue; }
    if (at.endsWith(".png")) {
      const size = pngSize(buf);
      if (!size) err(`interface.${k}: ${at} is not a valid PNG`);
      else if (size[0] !== size[1]) err(`interface.${k}: ${at} must be square (is ${size[0]}x${size[1]})`);
    }
  }

  // Files older clients read: generated, never hand-written.
  const claudeMcp = { mcpServers: Object.fromEntries(servers.map(([n, s]) => [n, { type: "http", url: s.url }])) };
  files.set(".mcp.json", Buffer.from(`${JSON.stringify(claudeMcp, null, 2)}\n`));
  const codex = {};
  for (const k of ["name", "version", "description", "author", "homepage", "repository", "license", "keywords"]) {
    if (manifest[k] !== undefined) codex[k] = manifest[k];
  }
  if (hasSkills) codex.skills = "./skills/";
  codex.mcpServers = "./.mcp.json";
  codex.interface = ui;
  files.set(".codex-plugin/plugin.json", Buffer.from(`${JSON.stringify(codex, null, 2)}\n`));

  return { name: manifest.name, version: manifest.version, files, errors, owed };
}

// A minimal deterministic ZIP writer (deflate, fixed timestamps, sorted entries): the same inputs
// always give the same bytes, so a rebuilt ZIP can be compared with the one in review.
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
const DOS_TIME = 0; // 00:00:00
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1; // 2026-01-01

export function zipBytes(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const name of [...files.keys()].sort()) {
    const data = files.get(name);
    const nameBuf = Buffer.from(name, "utf8");
    const packed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8); local.writeUInt16LE(DOS_TIME, 10); local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26); local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, packed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(0x0314, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(8, 10); central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14); central.writeUInt32LE(crc, 16); central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24); central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE((0o100644 << 16) >>> 0, 38); central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + packed.length;
  }
  const dir = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.size, 8); end.writeUInt16LE(files.size, 10);
  end.writeUInt32LE(dir.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, dir, end]);
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const outIdx = argv.indexOf("--out");
  const out = resolve(outIdx >= 0 ? argv[outIdx + 1] : join(REPO, "dist", "chatgpt"));
  const named = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--out");
  const slugs = named.length ? named : listPlugins();
  if (slugs.length === 0) { console.error(`no plugins under ${SOURCE_DIR}/`); return 1; }
  let failed = false;
  for (const slug of slugs) {
    const r = buildPlugin(slug);
    for (const e of r.errors) console.error(`✗ ${e}`);
    for (const o of r.owed) console.error(`${flags.has("--strict") ? "✗" : "…"} owed before submitting: ${o}`);
    if (r.errors.length || (flags.has("--strict") && r.owed.length)) { failed = true; continue; }
    if (flags.has("--check")) { console.log(`✓ ${slug} ${r.version} (${r.files.size} files)`); continue; }
    mkdirSync(out, { recursive: true });
    const file = join(out, `${r.name}-chatgpt-${r.version}.zip`);
    writeFileSync(file, zipBytes(r.files));
    console.log(`✓ ${relative(process.cwd(), file)} (${r.files.size} files)`);
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
