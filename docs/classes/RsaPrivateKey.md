# Class: RsaPrivateKey

## Table of contents

### Constructors

- [constructor](RsaPrivateKey.md#constructor)

### Methods

- [decrypt](RsaPrivateKey.md#decrypt)
- [sign](RsaPrivateKey.md#sign)

## Constructors

### constructor

• **new RsaPrivateKey**(`d`, `n`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `d` | `bigint` |
| `n` | `bigint` |

#### Defined in

rsa.ts:7

## Methods

### decrypt

▸ **decrypt**(`c`): `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | `bigint` |

#### Returns

`bigint`

#### Defined in

rsa.ts:12

___

### sign

▸ **sign**(`m`): `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `m` | `bigint` |

#### Returns

`bigint`

#### Defined in

rsa.ts:16
