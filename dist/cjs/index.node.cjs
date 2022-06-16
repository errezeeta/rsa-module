'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bcu = require('bigint-crypto-utils');
var bc = require('bigint-conversion');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var bcu__namespace = /*#__PURE__*/_interopNamespace(bcu);
var bc__namespace = /*#__PURE__*/_interopNamespace(bc);

class RsaPrivateKey {
    constructor(d, n) {
        this.d = d;
        this.n = n;
    }
    decrypt(c) {
        return bcu__namespace.modPow(c, this.d, this.n);
    }
    sign(m) {
        return bcu__namespace.modPow(m, this.d, this.n);
    }
}
// function rsaPrivateKeyFromJson (jsonStr: string) {
//   const keyPair = JSON.parse(jsonStr)
//   return new RsaPrivateKey(bc.hexToBigint(keyPair.d), bc.hexToBigint(keyPair.n))
// }
class RsaPublicKey {
    constructor(e, n) {
        this.e = e;
        this.n = n;
    }
    encrypt(m) {
        return bcu__namespace.modPow(m, this.e, this.n);
    }
    verify(s) {
        return bcu__namespace.modPow(s, this.e, this.n);
    }
    // public blindSign (m: bigint): bigint {
    //   const nonce = bcu.randBetween(this.n - 1n)
    //   console.log(nonce)
    //   const ms = m * nonce
    //   const res = '' + ms + ',' + nonce
    //   console.log(res)
    //   return res
    // }
    toJsonString() {
        return JSON.stringify({
            e: bc__namespace.bigintToHex(this.e),
            n: bc__namespace.bigintToHex(this.n)
        });
    }
}
// function rsaPublicKeyFromJson (jsonStr) {
//   const keyPair = JSON.parse(jsonStr)
//   return new RsaPublicKey(bc.hexToBigint(keyPair.e), bc.hexToBigint(keyPair.n))
// }
class RsaKeyPair {
    constructor(publicKey, privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
}
function isCoprime(a, b) {
    const exp = BigInt(1);
    return bcu__namespace.gcd(a, b) === exp;
}
function genE(mcm, nbits) {
    let e = bcu__namespace.randBetween(mcm, BigInt(1));
    while (!isCoprime(e, mcm)) {
        e = bcu__namespace.randBetween(mcm, BigInt(1));
    }
    return e;
}
async function generateKeys(bitLength = 2048) {
    let e = 0n;
    let p = 0n;
    let q = 0n;
    let n = 0n;
    let phi = 0n;
    do {
        p = await bcu__namespace.prime(bitLength / 2 + 1);
        q = await bcu__namespace.prime(bitLength / 2);
        n = p * q;
        phi = (p - 1n) * (q - 1n);
        const mcm = bcu__namespace.lcm(p - BigInt(1), q - BigInt(1));
        e = await genE(mcm);
    } while (bcu__namespace.bitLength(n) !== bitLength || (phi % e === 0n) || q === p);
    const publicKey = new RsaPublicKey(e, n);
    const d = bcu__namespace.modInv(e, phi);
    const privKey = new RsaPrivateKey(d, n);
    const keys = new RsaKeyPair(publicKey, privKey);
    return keys;
}

exports.RsaKeyPair = RsaKeyPair;
exports.RsaPrivateKey = RsaPrivateKey;
exports.RsaPublicKey = RsaPublicKey;
exports.generateKeys = generateKeys;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5janMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cy9yc2EudHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbImJjdSIsImJjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BR2EsYUFBYSxDQUFBO0lBR3hCLFdBQWEsQ0FBQSxDQUFTLEVBQUUsQ0FBUyxFQUFBO0FBQy9CLFFBQUEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDVixRQUFBLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ1g7QUFFTSxJQUFBLE9BQU8sQ0FBRSxDQUFTLEVBQUE7QUFDdkIsUUFBQSxPQUFPQSxjQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQztBQUVNLElBQUEsSUFBSSxDQUFFLENBQVMsRUFBQTtBQUNwQixRQUFBLE9BQU9BLGNBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3JDO0FBUUYsQ0FBQTtBQUVEO0FBQ0E7QUFDQTtBQUNBO01BRWEsWUFBWSxDQUFBO0lBSXZCLFdBQWEsQ0FBQSxDQUFTLEVBQUUsQ0FBUyxFQUFBO0FBQy9CLFFBQUEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDVixRQUFBLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ1g7QUFFTSxJQUFBLE9BQU8sQ0FBRSxDQUFTLEVBQUE7QUFDdkIsUUFBQSxPQUFPQSxjQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQztBQUVNLElBQUEsTUFBTSxDQUFFLENBQVMsRUFBQTtBQUN0QixRQUFBLE9BQU9BLGNBQUcsQ0FBQyxN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
