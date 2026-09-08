# NumberingPublicApiClient

`sap.dm.dme.pod2.api.numbering.NumberingPublicApiClient`

## Constructor

```
new NumberingPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.numbering.CreateIdentifiersRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) createIdentifier) (oRequest, oOptionsopt) → {Promise.<string>}

Create identifiers for business objects upon specified events at a plant.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.numbering.CreateIdentifiersRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<string> - Promise.<string>

**See also:** [https://api.sap.com/api/sapdme_numbering/path/post_identifiers](https://api.sap.com/api/sapdme_numbering/path/post_identifiers)
