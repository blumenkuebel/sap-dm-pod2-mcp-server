# POD2 API Specs — Version

- **SAP DM release**: 2608
- **Generated**: 2026-09-08
- **Class/namespace docs**: 505 (+ `index.md`)
- **Source**: [SAP-samples/digital-manufacturing-extension-samples](https://github.com/SAP-samples/digital-manufacturing-extension-samples) → `documentation/jsdoc-pod2-2608.zip`
- **License**: Apache-2.0 (see `LICENSE` and `NOTICE` in this folder)

## What this is

Markdown API reference for SAP Digital Manufacturing POD 2.0, converted from the
official POD 2.0 JSDoc HTML bundle that SAP publishes (Apache-2.0) in the
`SAP-samples` repository above. Because the source is Apache-2.0 licensed, this
snapshot **may be committed and redistributed** together with the accompanying
`LICENSE`/`NOTICE`.

## Regenerate / bump the release

SAP Digital Manufacturing ships in release waves (`YYMM`, e.g. `2601`, `2608`).

> **Latest available bundles:** browse the current JSDoc release waves at
> https://github.com/SAP-samples/digital-manufacturing-extension-samples/tree/main/documentation
> (files named `jsdoc-pod2-<YYMM>.zip`).

To regenerate from a different wave:

```bash
# 1. Download the JSDoc bundle for the target release from the SAP-samples repo:
#    documentation/jsdoc-pod2-<YYMM>.zip
# 2. Unzip into docu/_import/jsdoc-pod2-<YYMM>/  (yielding a docs/ subfolder)
# 3. Regenerate:
npm run extract-docs -- --release <YYMM>
```

The release is recorded in `index.md` (`SAP DM release: <YYMM>`) and in this file.
