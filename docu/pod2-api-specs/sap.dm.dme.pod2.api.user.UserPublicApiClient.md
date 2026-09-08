# UserPublicApiClient

`sap.dm.dme.pod2.api.user.UserPublicApiClient`

## Constructor

```
new UserPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.user.GetUserRequest | No | The user retrieval request |

## Methods

### (async) getUser (oRequest) → {Promise.<sap.dm.dme.pod2.api.user.User>}

Retrieves user information by plant and user ID, email, or badge number.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.user.GetUserRequest | No | The user retrieval request |

**Returns:** Promise.<sap.dm.dme.pod2.api.user.User> - Promise.<[sap.dm.dme.pod2.api.user.User](sap.dm.dme.pod2.api.user.md#.User)>
