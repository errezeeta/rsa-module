# Class: RsaPublicKey

## Table of contents

### Constructors

- [constructor](RsaPublicKey.md#constructor)

### Methods

- [encrypt](RsaPublicKey.md#encrypt)
- [toJsonString](RsaPublicKey.md#tojsonstring)
- [verify](RsaPublicKey.md#verify)

## Constructors

### constructor

• **new RsaPublicKey**(`e`, `n`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `bigint` |
| `n` | `bigint` |

#### Defined in

rsa.ts:37

## Methods

### encrypt

▸ **encrypt**(`m`): `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `m` | `bigint` |

#### Returns

`bigint`

#### Defined in

rsa.ts:42

___

### toJsonString

▸ **toJsonString**(): `string`

#### Returns

`string`

#### Defined in

rsa.ts:59

___

### verify

▸ **verify**(`s`): `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `bigint` |

#### Returns

`bigint`

#### Defined in

rsa.ts:46
