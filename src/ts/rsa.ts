import * as bcu from 'bigint-crypto-utils'
import * as bc from 'bigint-conversion'

export class RsaPrivateKey {
  readonly d: bigint
  readonly n: bigint
  constructor (d: bigint, n: bigint) {
    this.d = d
    this.n = n
  }

  public decrypt (c: bigint): bigint {
    return bcu.modPow(c, this.d, this.n)
  }

  public sign (m: bigint): bigint {
    return bcu.modPow(m, this.d, this.n)
  }

  // toJsonString () {
  //   return JSON.stringify({
  //     d: bc.bigintToHex(this.d),
  //     n: bc.bigintToHex(this.n)
  //   })
  // }
}

// function rsaPrivateKeyFromJson (jsonStr: string) {
//   const keyPair = JSON.parse(jsonStr)
//   return new RsaPrivateKey(bc.hexToBigint(keyPair.d), bc.hexToBigint(keyPair.n))
// }

export class RsaPublicKey {
  readonly e: bigint
  readonly n: bigint

  constructor (e: bigint, n: bigint) {
    this.e = e
    this.n = n
  }

  public encrypt (m: bigint): bigint {
    return bcu.modPow(m, this.e, this.n)
  }

  public verify (s: bigint): bigint {
    return bcu.modPow(s, this.e, this.n)
  }

  // public blindSign (m: bigint): bigint {
  //   const nonce = bcu.randBetween(this.n - 1n)
  //   console.log(nonce)
  //   const ms = m * nonce
  //   const res = '' + ms + ',' + nonce
  //   console.log(res)
  //   return res
  // }

  public toJsonString (): string {
    return JSON.stringify({
      e: bc.bigintToHex(this.e),
      n: bc.bigintToHex(this.n)
    })
  }
}

// function rsaPublicKeyFromJson (jsonStr) {
//   const keyPair = JSON.parse(jsonStr)
//   return new RsaPublicKey(bc.hexToBigint(keyPair.e), bc.hexToBigint(keyPair.n))
// }

export class RsaKeyPair {
  readonly publicKey: RsaPublicKey
  readonly privateKey: RsaPrivateKey

  constructor (publicKey: RsaPublicKey, privateKey: RsaPrivateKey) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
}

function isCoprime (a: bigint, b: bigint): boolean {
  const exp: bigint = BigInt(1)
  return bcu.gcd(a, b) === exp
}

function genE (mcm: bigint, nbits: number): bigint {
  let e: bigint = bcu.randBetween(mcm, BigInt(1))
  while (!isCoprime(e, mcm)) {
    e = bcu.randBetween(mcm, BigInt(1))
  }

  return e
}

export async function generateKeys (bitLength = 2048): Promise<RsaKeyPair> {
  let e = 0n
  let p = 0n; let q = 0n; let n = 0n; let phi = 0n
  do {
    p = await bcu.prime(bitLength / 2 + 1)
    q = await bcu.prime(bitLength / 2)
    n = p * q
    phi = (p - 1n) * (q - 1n)
    const mcm: bigint = bcu.lcm(p - BigInt(1), q - BigInt(1))
    e = await genE(mcm, bitLength)
  } while (bcu.bitLength(n) !== bitLength || (phi % e === 0n) || q === p)

  const publicKey = new RsaPublicKey(e, n)

  const d = bcu.modInv(e, phi)

  const privKey = new RsaPrivateKey(d, n)

  const keys = new RsaKeyPair(publicKey, privKey)

  return keys
}
