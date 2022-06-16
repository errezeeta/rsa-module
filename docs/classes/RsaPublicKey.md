# Class: RsaPublicKey

## Table of contents

### Constructors

- [constructor](RsaPublicKey.md#constructor)

### Properties

- [e](RsaPublicKey.md#e)
- [n](RsaPublicKey.md#n)

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

[rsa.ts:37](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L37)

## Properties

### e

• `Readonly` **e**: `bigint`

#### Defined in

[rsa.ts:34](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L34)

___

### n

• `Readonly` **n**: `bigint`

#### Defined in

[rsa.ts:35](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L35)

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

[rsa.ts:42](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L42)

___

### toJsonString

▸ **toJsonString**(): `string`

#### Returns

`string`

#### Defined in

[rsa.ts:59](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L59)

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

[rsa.ts:46](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L46)
