# Common Mistakes — 🌍 Internationalization

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.
>
> **Language list & file naming** → for the complete set of 28 supported languages, ISO 639-1 codes, and the `i18n_<code>.properties` naming convention (zh_TW/pt/es/sr special cases, ResourceModel fallback), see [`sap-dm-languages.md`](sap-dm-languages.md).

---

## Mistake #30: Wrong German i18n — "SFC" Instead of "PSN" ❌ → ✅

**Error**: German UI shows technical jargon ("SFC") instead of the SAP standard term users actually know ("PSN" = Produktionsstücknummer).

**Found in**: `i18n_de.properties` files, German labels for table columns, dialogs, buttons.

**Critical for German plants**: SAP Digital Manufacturing's standard German UI uses **PSN** everywhere. A custom plugin that says "SFC" in `i18n_de.properties` instantly looks wrong, breaks user habits, and clashes with the surrounding standard SAP DM screens.

### The Rule: Code stays `sfc` / `SFC`, only the German translation changes

| Layer                       | English        | German (correct)               |
|-----------------------------|----------------|--------------------------------|
| API field / JSON property   | `sfc`, `sfcStatus` | `sfc`, `sfcStatus` *(unchanged)* |
| Code identifier / variable  | `sSfc`, `oSfcInfo` | `sSfc`, `oSfcInfo` *(unchanged)* |
| i18n **key**                | `label.sfc`    | `label.sfc` *(unchanged)*      |
| i18n **value** (en bundle)  | `SFC`          | —                              |
| i18n **value** (de bundle)  | —              | `PSN`                          |

**Rule of thumb**: Anything that is *code* keeps `sfc` / `SFC`. Only the *human-readable text* in `i18n_de.properties` becomes `PSN`.

### ❌ WRONG — German file just copies "SFC"

```properties
# i18n_de.properties
label.sfc=SFC
label.sfcStatus=SFC-Status
button.startSfc=SFC starten
column.sfcNumber=SFC-Nummer
message.sfcNotFound=SFC {0} wurde nicht gefunden
```

Symptoms in production:
- German operators ask "Was ist eine SFC?" → they only know PSN
- Plugin labels stand out as foreign next to the standard SAP DM German UI
- Training material / SOPs use "PSN" → mismatch with your plugin

### ✅ CORRECT — German file uses "PSN"

```properties
# i18n_de.properties
label.sfc=PSN
label.sfcStatus=PSN-Status
button.startSfc=PSN starten
column.sfcNumber=PSN
message.sfcNotFound=PSN {0} wurde nicht gefunden
```

```properties
# i18n.properties (default / English)
label.sfc=SFC
label.sfcStatus=SFC Status
button.startSfc=Start SFC
column.sfcNumber=SFC Number
message.sfcNotFound=SFC {0} not found
```

### Code is unaffected

```javascript
// ✅ Still "sfc" everywhere — never rename code to "psn"!
const sSfc = oWorkListItem.sfc;
PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSfcChanged, this);

// Look up the label via i18n key — the bundle decides EN/DE
const sLabel = this.getI18nText("label.sfc");   // → "SFC" (en) / "PSN" (de)
oButton.setText(this.getI18nText("button.startSfc"));
```

### Why This Happens

1. Developers translate field names **1:1** — "SFC" looks like a proper noun, so it's left untouched.
2. They don't know that **PSN (Produktionsstücknummer)** is SAP's official German term for a Shop Floor Control number.
3. The bug is invisible to non-German speakers in code review.

### Detection / Quick Audit

```bash
# Find SFC literals in German bundles — every hit should be reviewed
grep -nE '=\s*.*SFC' i18n/i18n_de.properties

# Reverse check: ensure English bundle does NOT use PSN
grep -nE '=\s*.*PSN' i18n/i18n.properties i18n/i18n_en.properties
```

### Prevention

- ✅ Translate every user-facing `SFC` → `PSN` in `*_de.properties`
- ✅ Keep `sfc` / `SFC` in **code, API fields, JSON, i18n keys** — never rename
- ✅ Cross-check your German labels against SAP DM's standard German UI before release
- ✅ Native-German review of every `i18n_de.properties` change
- ❌ Don't rename code identifiers (`sSfc` stays `sSfc`, never `sPsn`)
- ❌ Don't invent your own German term ("Werkstück", "Auftragsstück", "Stück-Nr." etc.)
- ❌ Don't leave "SFC" in `i18n_de.properties` — it's wrong, even though it "compiles"

### Related

- [`docu/worklist-data-structure.md`](worklist-data-structure.md) — `sfc` field reference
- [Mistake #35: Missing i18nCustomModel Registration in `onInit()`](common-mistakes-lifecycle.md#mistake-35-missing-i18ncustommodel-registration-in-oninit) — how to load i18n in a widget

---

---


## Mistake #40: Unescaped Curly Braces and Single Quotes in i18n Properties

**Error**: `formatMessage: pattern syntax error at pos XX` at runtime. The widget's i18n text shows as raw key or the entire POD page throws a console error.

**Found in**: `i18n.properties` / `i18n_de.properties` files where description text contains literal `{`, `}`, or `'` characters.

**Critical**: UI5's `ResourceBundle` uses Java `MessageFormat` syntax internally. In this syntax:
- `{0}`, `{1}` are positional placeholders
- `{` and `}` are **reserved** metacharacters
- `'` (single quote) is the **escape character**

Any literal occurrence of these characters in i18n values MUST be escaped or the parser throws a syntax error.

### WRONG - Literal braces and single quotes in i18n values

```properties
# i18n.properties
coating.description = Monitors coating parameters { Plant, Resource }
coating.hint = Enter the operator's thickness reading
coating.info = Values in range {min} - {max} are acceptable
```

The `{ Plant, Resource }` is parsed as a malformed MessageFormat select/choice pattern. The `'s` starts an unterminated quote escape. `{min}` is parsed as placeholder reference (but no such named arg exists).

### CORRECT - Escaped braces and single quotes

```properties
# i18n.properties

# Literal braces: wrap each brace in single quotes
coating.description = Monitors coating parameters '{'Plant, Resource'}'

# Literal single quote: double it
coating.hint = Enter the operator''s thickness reading

# If you WANT placeholders, use positional {0}, {1} - NOT named
coating.info = Values in range {0} - {1} are acceptable
```

### UI5 MessageFormat Escape Rules

| Character | Meaning in MessageFormat | How to make it literal |
|---|---|---|
| `{` | Start of placeholder | `'{'` |
| `}` | End of placeholder | `'}'` |
| `'` | Escape character | `''` (two single quotes) |
| `#` | Number format symbol (in sub-patterns) | `'#'` |

### Common Patterns That Trigger This

```properties
# WRONG - all of these will throw "pattern syntax error"
desc.fields = Shows { Status, Temperature, Pressure }
desc.format = Output format: {JSON}
desc.note = Don't forget to calibrate
desc.range = Acceptable: {0.5 - 2.0}

# CORRECT
desc.fields = Shows '{'Status, Temperature, Pressure'}'
desc.format = Output format: '{'JSON'}'
desc.note = Don''t forget to calibrate
desc.range = Acceptable: '{'0.5 - 2.0'}'
```

### When Placeholders ARE Intended

If you actually want to insert runtime values, use **positional** placeholders `{0}`, `{1}`, etc. and pass arguments via `getI18nText("key", [arg0, arg1])`:

```properties
# i18n.properties - with real placeholders
message.result = Measured {0} mm on {1} (target: {2} mm)
```

```javascript
// Widget code - positional args
const sText = this.getI18nText("message.result", [
    fThickness.toFixed(2),
    sSfcNumber,
    fTarget.toFixed(2)
]);
// -> "Measured 1.23 mm on SFC001 (target: 1.50 mm)"
```

### Why This Happens

1. **Developers write natural-language descriptions** with curly braces for grouping/listing items - not realizing they're MessageFormat metacharacters.
2. **Copy-paste from specs/emails** that contain `{Field1, Field2}` notation.
3. **Apostrophes in English** (`don't`, `operator's`, `it's`) trigger the escape mechanism.
4. The error only appears at runtime when `getI18nText()` or an `{i18n>...}` binding actually resolves the key - it's invisible during development if the key is never accessed.

### Detection

```bash
# Find unescaped curly braces in i18n files (potential issues)
grep -nE "\{[^0-9]" i18n/*.properties

# Find single quotes that are NOT doubled
grep -nE "[^']'[^']" i18n/*.properties | grep -v "'\{" | grep -v "'\}"
```

### Prevention

- Always escape literal `{` as `'{'` and `}` as `'}'` in i18n property values
- Always double single quotes: `''` for a literal `'`
- Use ONLY positional placeholders `{0}`, `{1}`, `{2}` - never named `{name}`
- Test every i18n key at runtime (the error is silent until the key is accessed)
- When listing items in descriptions, use parentheses or dashes instead of braces: `(Plant, Resource)` or `Plant / Resource`

### Related

- [Mistake #30: Wrong German i18n](#mistake-30-wrong-german-i18n--sfc-instead-of-psn) - other i18n pitfall
- [UI5 API: sap.base.i18n.ResourceBundle](https://sapui5.hana.ondemand.com/sdk/#/api/module:sap/base/i18n/ResourceBundle)
- [Java MessageFormat spec](https://docs.oracle.com/javase/8/docs/api/java/text/MessageFormat.html) - the underlying syntax UI5 implements

---

---
