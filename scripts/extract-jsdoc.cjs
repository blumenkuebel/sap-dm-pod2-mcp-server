#!/usr/bin/env node
/**
 * Extract SAP DM POD 2.0 JSDoc HTML -> Markdown for the MCP server.
 *
 * ⚠️  SAP-proprietary input. This script does NOT ship any SAP content. It converts a
 *     JSDoc export that YOU obtained from your own licensed source (SAP DM SDK / tenant)
 *     into the local `docu/pod2-api-specs/` folder, which is git-ignored.
 *
 * Usage:
 *   node scripts/extract-jsdoc.cjs [source-docs-dir] [--release <YYMM>]
 *
 * Release selection (SAP DM ships in release waves, format YYMM e.g. 2601, 2608):
 *   - `--release 2608`  or  env `SAP_DM_RELEASE=2608`
 *   - default: DEFAULT_RELEASE below (keep in sync with src/config.ts DEFAULT_DM_RELEASE)
 *
 * Default source: docu/_import/jsdoc-pod2-<release>/docs
 * Output:         docu/pod2-api-specs/
 *
 * Extracts: title, description, extends, implements, constructor, properties,
 *           members, methods, code examples, see-also references.
 */
const fs = require("fs");
const path = require("path");

// Keep in sync with src/config.ts DEFAULT_DM_RELEASE
const DEFAULT_RELEASE = "2608";

const BASE_DIR = path.resolve(__dirname, "..");

function parseArgs(argv) {
  let srcArg = null;
  let release = process.env.SAP_DM_RELEASE || DEFAULT_RELEASE;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--release") release = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log("Usage: node scripts/extract-jsdoc.cjs [source-docs-dir] [--release <YYMM>]");
      process.exit(0);
    } else if (!srcArg) srcArg = a;
  }
  return { srcArg, release };
}

const { srcArg, release } = parseArgs(process.argv.slice(2));
const DEFAULT_SRC = path.join(BASE_DIR, "docu", "_import", `jsdoc-pod2-${release}`, "docs");
const OUT_DIR = path.join(BASE_DIR, "docu", "pod2-api-specs");
const srcDir = srcArg ? path.resolve(srcArg) : DEFAULT_SRC;

// --- Utility functions ---

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&rarr;/g, "→")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}

function strip(html) {
  return decode((html || "").replace(/<[^>]+>/g, "")).trim();
}

function toText(html) {
  if (!html) return "";
  let t = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<\/?p[^>]*>/gi, "\n");
  t = t.replace(/<code>([^<]*)<\/code>/g, "`$1`");
  t = t.replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g, (_, h, txt) => {
    if (h.startsWith("sap.dm.dme.") && h.includes(".html"))
      return "[" + txt + "](" + h.replace(/\.html(#|$)/, ".md$1") + ")";
    return txt;
  });
  return strip(t).replace(/\n{3,}/g, "\n\n").trim();
}

function getMain(html) {
  const i = html.indexOf('<div id="main">');
  if (i === -1) return html;
  return html.substring(i).replace(/<footer[\s\S]*?<\/footer>/gi, "");
}

// --- Parsing functions ---

function parseFile(fp) {
  const html = fs.readFileSync(fp, "utf-8");
  const main = getMain(html);

  const titleM = main.match(/<h1 class="page-title">([^<]+)<\/h1>/);
  const title = titleM ? titleM[1].trim() : path.basename(fp, ".html");

  // Full namespace from ancestors
  const nsM = main.match(/<span class="ancestors">([\s\S]*?)<\/span>/);
  const ns = nsM ? strip(nsM[1]).replace(/\s+/g, "") + title : title;

  const descM = main.match(/<div class="class-description usertext">([\s\S]*?)<\/div>/);
  const desc = descM ? toText(descM[1]) : "";

  // Extends — two patterns: <h3>Extends</h3>...<ul><li><a> OR <dt>Extends:</dt>...<a>
  let ext = null;
  const extH3 = main.match(/<h3[^>]*>Extends<\/h3>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
  if (extH3) {
    ext = { name: extH3[2], link: extH3[1].replace(/\.html$/, ".md") };
  } else {
    const extDt = main.match(/Extends:[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
    if (extDt) ext = { name: extDt[2], link: extDt[1].replace(/\.html$/, ".md") };
  }

  // Implements
  const implMatch = main.match(/<dt class="implements">Implements:<\/dt>\s*<dd class="implements">([\s\S]*?)<\/dd>/);
  const impls = [];
  if (implMatch) {
    const re = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
    let m;
    while ((m = re.exec(implMatch[1])) !== null) {
      impls.push({ name: m[2], link: m[1].replace(/\.html$/, ".md") });
    }
  }

  return {
    title,
    ns,
    desc,
    ext,
    impls,
    ctor: parseCtor(main),
    properties: parseProperties(main),
    members: parseMembers(main),
    methods: parseMethods(main),
  };
}

function parseCtor(main) {
  const m = main.match(/<h4 class="name"[^>]*>[\s\S]*?new\s+(\w+)\s*<span class="signature">\(([^)]*)\)<\/span>/);
  if (!m) return null;
  const idx = main.indexOf(m[0]);
  const sec = main.substring(idx, idx + 8000);
  return { name: m[1], sig: strip(m[2]), params: parseParams(sec) };
}

function parseParams(sec) {
  const tbl = sec.match(/<table class="params">([\s\S]*?)<\/table>/);
  if (!tbl) return [];
  const rows = [];
  const re = /<tr>\s*([\s\S]*?)<\/tr>/g;
  let rm;
  while ((rm = re.exec(tbl[1])) !== null) {
    const r = rm[1];
    if (r.includes("<th")) continue;
    const nm = r.match(/<td class="name"><code>([^<]*)<\/code><\/td>/);
    const tp = r.match(/<td class="type">([\s\S]*?)<\/td>/);
    const ds = r.match(/<td class="description last">([\s\S]*?)<\/td>/);
    if (nm) {
      const opt = r.toLowerCase().includes("optional") ? "Yes" : "No";
      rows.push({
        name: nm[1],
        type: tp ? strip(tp[1]).replace(/\s+/g, " ") : "",
        opt,
        desc: ds ? toText(ds[1]) : "",
      });
    }
  }
  return rows;
}

/**
 * Parse <table class="props"> — extracts property definitions.
 * These appear in constructor sections and $...Properties interfaces.
 */
function parseProperties(main) {
  // Find the props table in the container-overview (constructor area)
  const overviewStart = main.indexOf('<div class="container-overview">');
  if (overviewStart === -1) return parsePropsTable(main);

  // Look for props table within the overview section (before Members/Methods)
  const membersStart = main.indexOf('<h3 class="subsection-title">Members</h3>');
  const methodsStart = main.indexOf('<h3 class="subsection-title">Methods</h3>');
  const endBound = Math.min(
    membersStart > -1 ? membersStart : main.length,
    methodsStart > -1 ? methodsStart : main.length
  );
  const section = main.substring(overviewStart, endBound);
  return parsePropsTable(section);
}

function parsePropsTable(section) {
  const tbl = section.match(/<table class="props">([\s\S]*?)<\/table>/);
  if (!tbl) return [];
  const rows = [];
  const re = /<tr>\s*([\s\S]*?)<\/tr>/g;
  let rm;
  while ((rm = re.exec(tbl[1])) !== null) {
    const r = rm[1];
    if (r.includes("<th")) continue;
    const nm = r.match(/<td class="name"><code>([^<]*)<\/code><\/td>/);
    const tp = r.match(/<td class="type">([\s\S]*?)<\/td>/);
    const attr = r.match(/<td class="attributes">([\s\S]*?)<\/td>/);
    const ds = r.match(/<td class="description last">([\s\S]*?)<\/td>/);
    if (nm) {
      const optional = attr ? attr[1].toLowerCase().includes("optional") : false;
      const typeStr = tp ? strip(tp[1]).replace(/\s*\|\s*/g, " \\| ").replace(/\s+/g, " ") : "";
      rows.push({
        name: nm[1],
        type: typeStr,
        optional,
        desc: ds ? toText(ds[1]) : "",
      });
    }
  }
  return rows;
}

function parseMembers(main) {
  const start = main.indexOf('<h3 class="subsection-title">Members</h3>');
  if (start === -1) return [];
  const mstart = main.indexOf('<h3 class="subsection-title">Methods</h3>', start);
  const sec = mstart > -1 ? main.substring(start, mstart) : main.substring(start);
  const members = [];
  const re = /<h4 class="name" id="([^"]*)"[^>]*>([\s\S]*?)<\/h4>/g;
  let m;
  while ((m = re.exec(sec)) !== null) {
    const hdr = m[2];
    const name = strip(hdr.replace(/<span class="type-signature">[\s\S]*?<\/span>/g, ""));
    const typeM = hdr.match(/<span class="type-signature">\s*:([\s\S]*?)<\/span>/);
    const type = typeM ? strip(typeM[1]) : "";
    const si = m.index + m[0].length;
    const ni = sec.indexOf('<h4 class="name"', si);
    const blk = sec.substring(si, ni > -1 ? ni : undefined);
    const dM = blk.match(/<dt class="tag-description">[\s\S]*?<dd[^>]*>[\s\S]*?<li>([\s\S]*?)<\/li>/);
    members.push({ name, type, desc: dM ? toText(dM[1]) : "" });
  }
  return members;
}

function parseMethods(main) {
  const start = main.indexOf('<h3 class="subsection-title">Methods</h3>');
  if (start === -1) return [];
  const sec = main.substring(start);
  const re = /<h4 class="name" id="([^"]*)"[^>]*>([\s\S]*?)<\/h4>/g;
  const pos = [];
  let m;
  while ((m = re.exec(sec)) !== null)
    pos.push({ idx: m.index, end: m.index + m[0].length, id: m[1], hdr: m[2] });
  const methods = [];
  for (let i = 0; i < pos.length; i++) {
    const p = pos[i];
    const nxt = i + 1 < pos.length ? pos[i + 1].idx : sec.length;
    const blk = sec.substring(p.end, nxt);
    const sigM = p.hdr.match(/<span class="signature">\(([^)]*)\)<\/span>/);
    const sig = sigM ? strip(sigM[1]) : "";
    const retM = p.hdr.match(/type-signature">[^{]*\{([^}]*)\}/);
    const ret = retM ? strip(retM[1]) : "";
    let name = strip(
      p.hdr
        .replace(/<span class="type-signature">[\s\S]*?<\/span>/g, "")
        .replace(/<span class="signature">[\s\S]*?<\/span>/g, "")
    );
    const isAbstract = p.hdr.includes("abstract");
    const isOverridable = blk.includes("may be overridden");

    // Description
    const dM = blk.match(/<dt class="tag-description">[\s\S]*?<dd[^>]*>[\s\S]*?<li>([\s\S]*?)<\/li>/);
    const desc = dM ? toText(dM[1]) : "";

    // Parameters
    const params = parseParams(blk);

    // Return description
    const retDM = blk.match(/<h5[^>]*>Returns:<\/h5>[\s\S]*?<dd>([\s\S]*?)<\/dd>/);
    const retDesc = retDM ? toText(retDM[1]) : "";

    // Code example
    const example = parseExample(blk);

    // See also
    const seeAlso = parseSeeAlso(blk);

    methods.push({ name, sig, ret, desc, params, retDesc, isAbstract, isOverridable, example, seeAlso });
  }
  return methods;
}

/**
 * Extract code examples from <pre class="prettyprint"><code>...</code></pre>
 */
function parseExample(section) {
  const m = section.match(/<pre class="prettyprint"[^>]*><code>([\s\S]*?)<\/code><\/pre>/);
  if (!m) return "";
  return decode(m[1]).trim();
}

/**
 * Extract @see references
 */
function parseSeeAlso(section) {
  const m = section.match(/<dt class="tag-see">See:<\/dt>\s*<dd class="tag-see">([\s\S]*?)<\/dd>/);
  if (!m) return [];
  const refs = [];
  const re = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
  let rm;
  while ((rm = re.exec(m[1])) !== null) {
    refs.push({ name: rm[2], link: rm[1].replace(/\.html(#|$)/, ".md$1") });
  }
  return refs;
}

/**
 * Extract class-level example (in the overview section, not in a method)
 */
function parseClassExample(main) {
  const overviewStart = main.indexOf('<div class="container-overview">');
  if (overviewStart === -1) return "";
  const membersStart = main.indexOf('<h3 class="subsection-title">Members</h3>');
  const methodsStart = main.indexOf('<h3 class="subsection-title">Methods</h3>');
  const endBound = Math.min(
    membersStart > -1 ? membersStart : main.length,
    methodsStart > -1 ? methodsStart : main.length
  );
  const section = main.substring(overviewStart, endBound);
  return parseExample(section);
}

/**
 * Extract class-level @see
 */
function parseClassSeeAlso(main) {
  const overviewStart = main.indexOf('<div class="container-overview">');
  if (overviewStart === -1) return [];
  const membersStart = main.indexOf('<h3 class="subsection-title">Members</h3>');
  const methodsStart = main.indexOf('<h3 class="subsection-title">Methods</h3>');
  const endBound = Math.min(
    membersStart > -1 ? membersStart : main.length,
    methodsStart > -1 ? methodsStart : main.length
  );
  const section = main.substring(overviewStart, endBound);
  return parseSeeAlso(section);
}

// --- Markdown generation ---

function toMd(data) {
  const L = [];
  // Title with full namespace
  L.push("# " + data.title, "");
  if (data.ns !== data.title) L.push("`" + data.ns + "`", "");
  if (data.desc) L.push(data.desc, "");
  if (data.ext) L.push("**Extends:** [" + data.ext.name + "](" + data.ext.link + ")", "");
  if (data.impls.length > 0) {
    const links = data.impls.map((i) => "[" + i.name + "](" + i.link + ")").join(", ");
    L.push("**Implements:** " + links, "");
  }

  // Constructor
  if (data.ctor) {
    L.push("## Constructor", "", "```", "new " + data.ctor.name + " (" + data.ctor.sig + ")", "```", "");
    if (data.ctor.params.length > 0) {
      L.push("**Parameters:**", "");
      L.push("| Name | Type | Optional | Description |", "|------|------|----------|-------------|");
      for (const p of data.ctor.params)
        L.push("| `" + p.name + "` | " + p.type + " | " + p.opt + " | " + p.desc.replace(/\n/g, " ") + " |");
      L.push("");
    }
  }

  // Properties
  if (data.properties.length > 0) {
    L.push("## Properties", "");
    L.push("| Name | Type | Optional | Description |", "|------|------|----------|-------------|");
    for (const p of data.properties) {
      const optStr = p.optional ? "Yes" : "No";
      L.push("| `" + p.name + "` | " + p.type + " | " + optStr + " | " + p.desc.replace(/\n/g, " ") + " |");
    }
    L.push("");
  }

  // Members
  if (data.members.length > 0) {
    L.push("## Members", "");
    for (const mb of data.members) {
      L.push("### " + mb.name + (mb.type ? " :" + mb.type : ""), "");
      if (mb.desc) L.push(mb.desc, "");
    }
  }

  // Methods
  if (data.methods.length > 0) {
    L.push("## Methods", "");
    for (const mt of data.methods) {
      let h = "### ";
      if (mt.isAbstract) h += "(abstract) ";
      h += mt.name + " (" + mt.sig + ")";
      if (mt.ret) h += " → {" + mt.ret + "}";
      L.push(h, "");
      if (mt.desc) L.push(mt.desc, "");
      if (mt.isOverridable) L.push("🔧 This method may be overridden by custom subclasses.", "");
      if (mt.params.length > 0) {
        L.push("**Parameters:**", "");
        L.push("| Name | Type | Optional | Description |", "|------|------|----------|-------------|");
        for (const p of mt.params)
          L.push("| `" + p.name + "` | " + p.type + " | " + p.opt + " | " + p.desc.replace(/\n/g, " ") + " |");
        L.push("");
      }
      if (mt.ret) {
        L.push("**Returns:** " + mt.ret + (mt.retDesc ? " - " + mt.retDesc.replace(/\n/g, " ") : ""), "");
      }
      if (mt.example) {
        L.push("**Example:**", "", "```javascript", mt.example, "```", "");
      }
      if (mt.seeAlso.length > 0) {
        const refs = mt.seeAlso.map((s) => "[" + s.name + "](" + s.link + ")").join(", ");
        L.push("**See also:** " + refs, "");
      }
    }
  }

  return L.join("\n");
}

// --- Main ---

function main() {
  if (!fs.existsSync(srcDir)) {
    console.error("Source not found: " + srcDir);
    console.error("");
    console.error("This script needs a SAP DM POD 2.0 JSDoc export that you obtained from your");
    console.error("own licensed source (SAP DM SDK / tenant). Place it at:");
    console.error("  docu/_import/jsdoc-pod2-" + release + "/docs");
    console.error("or pass the path explicitly:  node scripts/extract-jsdoc.cjs <docs-dir> --release " + release);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.startsWith("sap.dm.dme.") && f.endsWith(".html"))
    .sort();
  console.log("Release: " + release);
  console.log("Source: " + srcDir);
  console.log("Output: " + OUT_DIR);
  console.log("Files:  " + files.length + " HTML files\n");
  const index = [];
  let ok = 0,
    err = 0;
  for (const file of files) {
    const mdName = file.replace(/\.html$/, ".md");
    try {
      const data = parseFile(path.join(srcDir, file));
      // Also extract class-level example/see (add to data for rendering)
      const html = fs.readFileSync(path.join(srcDir, file), "utf-8");
      const mainHtml = getMain(html);
      const classExample = parseClassExample(mainHtml);
      const classSeeAlso = parseClassSeeAlso(mainHtml);

      let md = toMd(data);

      // Append class-level example after description if present
      if (classExample) {
        const ctorIdx = md.indexOf("## Constructor");
        const propsIdx = md.indexOf("## Properties");
        const membersIdx = md.indexOf("## Members");
        const insertBefore = [ctorIdx, propsIdx, membersIdx].filter((i) => i > -1);
        const insertAt = insertBefore.length > 0 ? Math.min(...insertBefore) : md.length;
        const exBlock = "**Example:**\n\n```javascript\n" + classExample + "\n```\n\n";
        md = md.substring(0, insertAt) + exBlock + md.substring(insertAt);
      }

      // Append class-level see-also at the end
      if (classSeeAlso.length > 0) {
        const refs = classSeeAlso.map((s) => "[" + s.name + "](" + s.link + ")").join(", ");
        md += "\n**See also:** " + refs + "\n";
      }

      fs.writeFileSync(path.join(OUT_DIR, mdName), md, "utf-8");
      index.push({ name: data.title, file: mdName, methods: data.methods.length, members: data.members.length, props: data.properties.length });
      ok++;
    } catch (e) {
      console.error("  ERR: " + file + " - " + e.message);
      err++;
    }
  }
  const idx = [
    "# POD2 API Reference Index",
    "",
    "SAP DM release: " + release,
    "Generated: " + new Date().toISOString(),
    "",
    "Total: " + index.length + " classes/namespaces",
    "",
    "| Class | Methods | Members | Properties |",
    "|-------|---------|---------|------------|",
  ];
  for (const e of index)
    idx.push("| [" + e.name + "](" + e.file + ") | " + e.methods + " | " + e.members + " | " + e.props + " |");
  fs.writeFileSync(path.join(OUT_DIR, "index.md"), idx.join("\n"), "utf-8");
  console.log("Done! Success: " + ok + ", Errors: " + err);
  console.log("Properties extracted in " + index.filter((e) => e.props > 0).length + " files");
}

main();
