#!/usr/bin/env node
// Checks internal cross-links in docu/*.md:
//   - [text](target.md)        → target file must exist
//   - [text](target.md#anchor) → target file must exist AND contain the heading anchor
//   - [text](#anchor)          → anchor must exist in the same file
// Anchors are derived with GitHub's heading-slug algorithm (incl. duplicate suffixes).
// External links (http/https/mailto) and links to non-.md targets are ignored.
//
// Usage:  node scripts/check-doc-links.mjs [docuDir]
// Exit 0 = all good, 1 = dead links found. Also exported for the test suite.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DOCU_DIR = path.resolve(__dirname, "..", "docu");

/** GitHub-style heading → slug. */
export function slugify(heading) {
  let h = heading.trim().toLowerCase();
  h = h.replace(/`/g, ""); // drop code ticks
  h = h.replace(/[*~]/g, ""); // drop emphasis markers (keep underscores — GitHub keeps them)
  // strip everything that is not a word char (letters, digits, underscore), space or hyphen
  // (emoji, punctuation, slashes). Underscores are retained, matching GitHub.
  h = h.replace(/[^\p{L}\p{N}_ \-]/gu, "");
  h = h.replace(/ /g, "-"); // spaces → hyphen (each space individually, so "a / b" → "a--b")
  return h;
}

/** Collect the set of anchors a markdown file exposes (with -1/-2 dedup suffixes). */
export function collectAnchors(content) {
  const seen = new Map();
  const anchors = new Set();
  for (const line of content.split("\n")) {
    const m = line.match(/^#{1,6}\s+(.+?)\s*#*$/);
    if (!m) continue;
    let slug = slugify(m[1]);
    if (seen.has(slug)) {
      const n = seen.get(slug) + 1;
      seen.set(slug, n);
      slug = `${slug}-${n}`;
    } else {
      seen.set(slug, 0);
    }
    anchors.add(slug);
  }
  return anchors;
}

const LINK_RE = /\]\(([^)]+)\)/g;

/**
 * Scan a docu directory. Returns an array of { file, line, target, kind } for every dead link.
 * kind is "file" (missing target file) or "anchor" (file ok, heading missing).
 */
export function checkDocLinks(docuDir = DEFAULT_DOCU_DIR) {
  const mdFiles = fs
    .readdirSync(docuDir)
    .filter((f) => f.endsWith(".md"))
    // skip meta/working docs (leading underscore), e.g. _QA-IMPROVEMENT-PLAN.md
    .filter((f) => !f.startsWith("_"));
  const fileSet = new Set(mdFiles);
  const anchorCache = new Map();
  const anchorsFor = (file) => {
    if (!anchorCache.has(file)) {
      anchorCache.set(file, collectAnchors(fs.readFileSync(path.join(docuDir, file), "utf-8")));
    }
    return anchorCache.get(file);
  };

  const dead = [];
  for (const file of mdFiles) {
    const lines = fs.readFileSync(path.join(docuDir, file), "utf-8").split("\n");
    let inFence = false;
    lines.forEach((rawLine, idx) => {
      // skip fenced code blocks (``` or ~~~)
      if (/^\s*(```|~~~)/.test(rawLine)) {
        inFence = !inFence;
        return;
      }
      if (inFence) return;
      // strip inline code spans so `[x](y.md)` inside backticks is not treated as a link
      const line = rawLine.replace(/`[^`]*`/g, "");
      let m;
      LINK_RE.lastIndex = 0;
      while ((m = LINK_RE.exec(line)) !== null) {
        const raw = m[1].trim().split(/\s+/)[0]; // drop optional "title"
        if (/^(https?:|mailto:|tel:)/i.test(raw)) continue; // external
        const hashIdx = raw.indexOf("#");
        const filePart = hashIdx === -1 ? raw : raw.slice(0, hashIdx);
        const anchor = hashIdx === -1 ? null : raw.slice(hashIdx + 1);

        // same-file anchor link
        if (filePart === "") {
          if (anchor && !anchorsFor(file).has(anchor)) {
            dead.push({ file, line: idx + 1, target: `#${anchor}`, kind: "anchor" });
          }
          continue;
        }
        // only validate links that point at a .md doc
        if (!filePart.endsWith(".md")) continue;

        // Links that escape the docu tree (../foo, ../../README.md) can't be judged by a
        // docu-scoped checker — skip them.
        if (filePart.startsWith("../") || filePart.startsWith("/")) continue;

        // Links into a subdirectory of docu/ (e.g. pod2-api-specs/Foo.md): validate the
        // file exists on disk, but we don't parse anchors for those generated bundles.
        if (filePart.includes("/")) {
          const abs = path.join(docuDir, filePart);
          if (!fs.existsSync(abs)) {
            dead.push({ file, line: idx + 1, target: filePart, kind: "file" });
          }
          continue;
        }

        const base = path.basename(filePart);
        if (!fileSet.has(base)) {
          dead.push({ file, line: idx + 1, target: filePart, kind: "file" });
          continue;
        }
        if (anchor && !anchorsFor(base).has(anchor)) {
          dead.push({ file, line: idx + 1, target: `${base}#${anchor}`, kind: "anchor" });
        }
      }
    });
  }
  return dead;
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_DOCU_DIR;
  const dead = checkDocLinks(dir);
  if (dead.length === 0) {
    console.log(`✅ No dead internal doc links in ${dir}`);
    process.exit(0);
  }
  console.error(`❌ ${dead.length} dead internal doc link(s) in ${dir}:\n`);
  for (const d of dead) {
    console.error(`  ${d.file}:${d.line}  [${d.kind}] → ${d.target}`);
  }
  process.exit(1);
}
