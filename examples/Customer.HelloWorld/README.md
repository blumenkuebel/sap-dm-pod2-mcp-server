# Customer.HelloWorld – Minimal POD 2.0 Widget

The absolute starting template for POD 2.0 widget development. Use this as
your **first reference** before stepping up to `Customer.Coating` (full
best-practice with Validation/Execution actions and Context singleton).

---

## What it does

Displays a single line of text (`Hello, World!` / `Hallo, Welt!`) in the POD,
using the standard POD 2.0 i18n mechanism.

That's it. No actions, no API calls, no PodContext subscriptions, no
configurable properties. **Pure widget anatomy.**

---

## Components

| Component | File | Description |
|---|---|---|
| Widget | `widget/HelloWorldWidget.js` | The widget class (extends `Widget`) |
| i18n (fallback) | `i18n/i18n.properties` | Default English texts |
| i18n (German) | `i18n/i18n_de.properties` | German translation |
| i18n (English) | `i18n/i18n_en.properties` | English translation |
| i18n (en_US) | `i18n/i18n_en_US.properties` | US English variant |
| Manifest | `extension.json` | Plugin registration |

---

## Project Structure

```
Customer.HelloWorld/
├── extension.json
├── README.md
├── widget/
│   └── HelloWorldWidget.js
└── i18n/
    ├── i18n.properties
    ├── i18n_de.properties
    ├── i18n_en.properties
    └── i18n_en_US.properties
```

---

## Best-Practice Elements Demonstrated

| Element | Where | Why it matters |
|---|---|---|
| Static `I18nResourceModel` | `static #oI18nModel = new I18nResourceModel(...)` | One model shared across instances – no leak, no duplicate loads |
| Static metadata methods | `getDisplayName`, `getIcon`, `getCategory`, `getDescription` | Required by POD Designer for the widget catalog |
| `i18nCustomModel` registration in `onInit()` | `getPodRuntime().getView().setModel(model, "i18nHelloWorld")` | Enables `{i18nHelloWorld>key}` bindings inside your widget |
| Single source-of-truth namespace | `customer.custom.extensions.helloworld.*` | Matches the keys in `extension.json` `modulePath`/`type` |

---

## Configuration in Manage PODs 2.0

1. Pack the directory as a ZIP (`Customer.HelloWorld.zip`) – `extension.json`
   must be at the **ZIP root**.
2. **Manage Extensions** → **Create** → upload the ZIP.
3. Open the **POD Designer** for any POD and drag the
   *"Hello World Widget"* (Category: *Examples*) onto the layout.
4. Save & open the POD as runtime – you should see *"Hello, World!"* (or
   *"Hallo, Welt!"* with the browser language set to German).

---

## What's NOT in this example

- **No actions** → see `Customer.Coating` for the
  `ValidationAction → ExecutionAction` pattern.
- **No `PodContext.subscribe()`** → see `Customer.TableView` and
  `subscribe-patterns` doc.
- **No configurable widget properties** → see `property-editors` doc and
  `Customer.Utils` for `EnumPropertyEditor`.
- **No API calls** → see `pod2-public-api-pattern` doc.

---

## Disclaimer

This sample plugin is provided "as is" for educational purposes. Use as a
starting template, adapt the namespace to your own (`customer.custom.*`),
and extend it as needed.