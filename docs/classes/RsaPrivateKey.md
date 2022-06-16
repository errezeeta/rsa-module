# Class: RsaPrivateKey

## Table of contents

### Constructors

- [constructor](RsaPrivateKey.md#constructor)

### Properties

- [d](RsaPrivateKey.md#d)
- [n](RsaPrivateKey.md#n)

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

[rsa.ts:7](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L7)

## Properties

### d

• `Readonly` **d**: `bigint`

#### Defined in

[rsa.ts:5](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L5)

___

### n

• `Readonly` **n**: `bigint`

#### Defined in

[rsa.ts:6](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L6)

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

[rsa.ts:12](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L12)

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

[rsa.ts:16](https://github.com/errezeeta/rsa-module/blob/1595518/src/ts/rsa.ts#L16)
