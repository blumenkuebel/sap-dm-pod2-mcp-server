# Third-Party Notices

This project (**sap-dm-pod2-mcp-server**) is licensed under the MIT License (see `LICENSE`).
It includes documentation material adapted from third-party open-source work, redistributes the
SAP Digital Manufacturing POD 2.0 **API reference** (published by SAP under Apache-2.0) and
SAPUI5 API metadata generated from **OpenUI5** (Apache-2.0). The required copyright and
permission notices are listed below.

> **Disclaimer & trademarks.** This is an independent, community-maintained project. It is
> **not an official SAP product** and is **not affiliated with, sponsored, or endorsed by SAP**.
> "SAP", "SAP Digital Manufacturing", "SAPUI5", "OpenUI5" and related marks are trademarks or
> registered trademarks of SAP SE (or an SAP affiliate company); they are used here only for
> identification and do not imply any endorsement. **SAP provides no support** for this project.
> No trademark rights are granted by the licenses below (Apache-2.0 §6).

> **What is NOT redistributed here.** Some SAP-proprietary, tenant-bound artifacts are
> deliberately **not** shipped with this repository. The SAP DM REST OpenAPI specs
> (`docu/sap-dm-api-specs/`) and the MDO Extractor OData metadata (`docu/sap-dm-mdo-specs/`)
> are git-ignored and must be fetched/generated locally by the user from their **own licensed
> sources** (their SAP DM tenant) via `npm run prepare:specs` / `npm run fetch-rest-specs`.
> Your use of those SAP materials is governed by the applicable SAP terms of use / license —
> this MIT license does not grant any rights to them.

---

## 1. SAP DM AI POD Skill (pattern & reference documentation)

- **Project**: SAP DM AI POD Skill (an independent community project — **not** an official SAP product)
- **Source**: https://github.com/KevinHunter12/SAP_DM_AI_POD_SKILL
- **Author**: KevinHunter12 (GitHub handle)
- **License**: MIT

Portions of the hand-written pattern & reference documentation in `docu/*.md` — including
(but not limited to) the common-mistakes, widget-patterns, advanced-patterns, pattern-index,
API-reference, binding-patterns, table-widget / table-cell, error-handling, tree-patterns,
glossary and supported-languages material — are adapted from the *SAP DM AI POD Skill*
community project. We gratefully acknowledge that work.

The following MIT permission notice applies to the adapted material:

```
MIT License

Copyright (c) KevinHunter12 (SAP DM AI POD Skill contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

> **Note on the copyright line**: the upstream repository snapshot available here does not
> include a `LICENSE` file with a full legal name, so the copyright holder is identified by
> the project and its GitHub handle. If a full name / exact copyright line becomes available
> upstream, reconcile this notice with it.

---

## 2. OpenUI5 (SAPUI5 API metadata)

- **Project**: OpenUI5
- **Source**: https://github.com/SAP/openui5 · https://sdk.openui5.org
- **Copyright**: Copyright (c) 2009-present SAP SE or an SAP affiliate company and OpenUI5 contributors
- **License**: Apache License, Version 2.0

The SAPUI5 API metadata under `docu/ui5-api-specs/` is generated from **OpenUI5**, which is
licensed under the Apache License, Version 2.0. A copy of the Apache-2.0 license and the
OpenUI5 `NOTICE` are placed inside `docu/ui5-api-specs/` when the specs are generated
(`npm run update-ui5-api-specs`). You may obtain a copy of the Apache-2.0 license at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the
Apache-2.0 license is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
ANY KIND, either express or implied. See the license for the specific language governing
permissions and limitations.

> Note: only libraries that ship with OpenUI5 are included (e.g. `sap.m`, `sap.ui.core`,
> `sap.ui.layout`, `sap.f`, `sap.ui.table`, `sap.tnt`, `sap.ui.unified`). SAPUI5-only
> libraries (`sap.suite.*`, `sap.ui.comp`, `sap.ushell`, …) are proprietary and are **not**
> bundled.

---

## 3. SAP Digital Manufacturing POD 2.0 API reference (`docu/pod2-api-specs/`)

- **Project**: digital-manufacturing-extension-samples
- **Source**: https://github.com/SAP-samples/digital-manufacturing-extension-samples · artifact `documentation/jsdoc-pod2-<release>.zip` (e.g. `jsdoc-pod2-2608.zip`)
- **Copyright**: Copyright © 2020 SAP SE or an SAP affiliate company. All rights reserved.
- **License**: Apache License, Version 2.0

The Markdown API reference under `docu/pod2-api-specs/` is generated from the official POD 2.0
JSDoc documentation bundle that SAP publishes under Apache-2.0 in the `SAP-samples` repository
above. Because the source is Apache-2.0 licensed, this snapshot **is** committed and
redistributed together with the folder's own `LICENSE`, `NOTICE`, and `VERSION.md`. The only
modification is presentation format (JSDoc HTML → Markdown via `scripts/extract-jsdoc.cjs`); no
API facts were altered. You may obtain a copy of the Apache-2.0 license at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the
Apache-2.0 license is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
ANY KIND, either express or implied. See the license for the specific language governing
permissions and limitations.

> Refresh / bump the release with `npm run extract-docs -- --release <YYMM>`; the loaded
> release is recorded in `docu/pod2-api-specs/VERSION.md` and `index.md`.
