import * as bcu from 'bigint-crypto-utils';
import * as bc from 'bigint-conversion';

class RsaPrivateKey {
    constructor(d, n) {
        this.d = d;
        this.n = n;
    }
    decrypt(c) {
        return bcu.modPow(c, this.d, this.n);
    }
    sign(m) {
        return bcu.modPow(m, this.d, this.n);
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
        return bcu.modPow(m, this.e, this.n);
    }
    verify(s) {
        return bcu.modPow(s, this.e, this.n);
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
            e: bc.bigintToHex(this.e),
            n: bc.bigintToHex(this.n)
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
async function generateKeys(bitLength = 2048) {
    const e = 65537n;
    let p = 0n;
    let q = 0n;
    let n = 0n;
    let phi = 0n;
    do {
        p = await bcu.prime(bitLength / 2 + 1);
        q = await bcu.prime(bitLength / 2);
        n = p * q;
        phi = (p - 1n) * (q - 1n);
    } while (bcu.bitLength(n) !== bitLength || (phi % e === 0n) || q === p);
    const publicKey = new RsaPublicKey(e, n);
    const d = bcu.modInv(e, phi);
    const privKey = new RsaPrivateKey(d, n);
    const keys = new RsaKeyPair(publicKey, privKey);
    return keys;
}

export { RsaPrivateKey, RsaPublicKey, generateKeys };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL3JzYS50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O01BR2EsYUFBYSxDQUFBO0lBR3hCLFdBQWEsQ0FBQSxDQUFTLEVBQUUsQ0FBUyxFQUFBO0FBQy9CLFFBQUEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDVixRQUFBLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ1g7QUFFTSxJQUFBLE9BQU8sQ0FBRSxDQUFTLEVBQUE7QUFDdkIsUUFBQSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3JDO0FBRU0sSUFBQSxJQUFJLENBQUUsQ0FBUyxFQUFBO0FBQ3BCLFFBQUEsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQztBQVFGLENBQUE7QUFFRDtBQUNBO0FBQ0E7QUFDQTtNQUVhLFlBQVksQ0FBQTtJQUl2QixXQUFhLENBQUEsQ0FBUyxFQUFFLENBQVMsRUFBQTtBQUMvQixRQUFBLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ1YsUUFBQSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNYO0FBRU0sSUFBQSxPQUFPLENBQUUsQ0FBUyxFQUFBO0FBQ3ZCLFFBQUEsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQztBQUVNLElBQUEsTUFBTSxDQUFFLENBQVMsRUFBQTtBQUN0QixRQUFBLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckM7Ozs7Ozs7OztJQVdNLFlBQVksR0FBQTtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFNBQUEsQ0FBQyxDQUFBO0tBQ0g7QUFDRixDQUFBO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNLFVBQVUsQ0FBQTtJQUlkLFdBQWEsQ0FBQSxTQUF1QixFQUFFLFVBQXlCLEVBQUE7QUFDN0QsUUFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0tBQzdCO0FBQ0YsQ0FBQTtBQUVNLGVBQWUsWUFBWSxDQUFFLFNBQVMsR0FBRyxJQUFJLEVBQUE7SUFDbEQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFBO0lBQ2hCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQTtJQUNoRCxHQUFHO0FBQ0QsUUFBQSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDdEMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDbEMsUUFBQSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNULFFBQUEsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7S0FDMUIsUUFBUSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUM7SUFFdkUsTUFBTSxTQUFTLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRXhDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBRTVCLE1BQU0sT0FBTyxHQUFHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUV2QyxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFFL0MsSUFBQSxPQUFPLElBQUksQ0FBQTtBQUNiOzs7OyJ9
