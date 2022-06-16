/**
 * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
 *
 * @param a
 *
 * @returns The absolute value of a
 */
function abs(a) {
    return (a >= 0) ? a : -a;
}

/**
 * Returns the bitlength of a number
 *
 * @param a
 * @returns The bit length
 */
function bitLength(a) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (a === 1n) {
        return 1;
    }
    let bits = 1;
    do {
        bits++;
    } while ((a >>= 1n) > 1n);
    return bits;
}

/**
 * An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm.
 * Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
 *
 * @param a
 * @param b
 *
 * @throws {RangeError}
 * This excepction is thrown if a or b are less than 0
 *
 * @returns A triple (g, x, y), such that ax + by = g = gcd(a, b).
 */
function eGcd(a, b) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof b === 'number')
        b = BigInt(b);
    if (a <= 0n || b <= 0n)
        throw new RangeError('a and b MUST be > 0'); // a and b MUST be positive
    let x = 0n;
    let y = 1n;
    let u = 1n;
    let v = 0n;
    while (a !== 0n) {
        const q = b / a;
        const r = b % a;
        const m = x - (u * q);
        const n = y - (v * q);
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return {
        g: b,
        x: x,
        y: y
    };
}

/**
 * Greatest-common divisor of two integers based on the iterative binary algorithm.
 *
 * @param a
 * @param b
 *
 * @returns The greatest common divisor of a and b
 */
function gcd(a, b) {
    let aAbs = (typeof a === 'number') ? BigInt(abs(a)) : abs(a);
    let bAbs = (typeof b === 'number') ? BigInt(abs(b)) : abs(b);
    if (aAbs === 0n) {
        return bAbs;
    }
    else if (bAbs === 0n) {
        return aAbs;
    }
    let shift = 0n;
    while (((aAbs | bAbs) & 1n) === 0n) {
        aAbs >>= 1n;
        bAbs >>= 1n;
        shift++;
    }
    while ((aAbs & 1n) === 0n)
        aAbs >>= 1n;
    do {
        while ((bAbs & 1n) === 0n)
            bAbs >>= 1n;
        if (aAbs > bAbs) {
            const x = aAbs;
            aAbs = bAbs;
            bAbs = x;
        }
        bAbs -= aAbs;
    } while (bAbs !== 0n);
    // rescale
    return aAbs << shift;
}

/**
 * The least common multiple computed as abs(a*b)/gcd(a,b)
 * @param a
 * @param b
 *
 * @returns The least common multiple of a and b
 */
function lcm(a, b) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof b === 'number')
        b = BigInt(b);
    if (a === 0n && b === 0n)
        return BigInt(0);
    // return abs(a * b) as bigint / gcd(a, b)
    return abs((a / gcd(a, b)) * b);
}

/**
 * Finds the smallest positive element that is congruent to a in modulo n
 *
 * @remarks
 * a and b must be the same type, either number or bigint
 *
 * @param a - An integer
 * @param n - The modulo
 *
 * @throws {RangeError}
 * Excpeption thrown when n is not > 0
 *
 * @returns A bigint with the smallest positive representation of a modulo n
 */
function toZn(a, n) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof n === 'number')
        n = BigInt(n);
    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }
    const aZn = a % n;
    return (aZn < 0n) ? aZn + n : aZn;
}

/**
 * Modular inverse.
 *
 * @param a The number to find an inverse for
 * @param n The modulo
 *
 * @throws {RangeError}
 * Excpeption thorwn when a does not have inverse modulo n
 *
 * @returns The inverse modulo n
 */
function modInv(a, n) {
    const egcd = eGcd(toZn(a, n), n);
    if (egcd.g !== 1n) {
        throw new RangeError(`${a.toString()} does not have inverse modulo ${n.toString()}`); // modular inverse does not exist
    }
    else {
        return toZn(egcd.x, n);
    }
}

/**
 * Modular exponentiation b**e mod n. Currently using the right-to-left binary method
 *
 * @param b base
 * @param e exponent
 * @param n modulo
 *
 * @throws {RangeError}
 * Excpeption thrown when n is not > 0
 *
 * @returns b**e mod n
 */
function modPow(b, e, n) {
    if (typeof b === 'number')
        b = BigInt(b);
    if (typeof e === 'number')
        e = BigInt(e);
    if (typeof n === 'number')
        n = BigInt(n);
    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }
    else if (n === 1n) {
        return 0n;
    }
    b = toZn(b, n);
    if (e < 0n) {
        return modInv(modPow(b, abs(e), n), n);
    }
    let r = 1n;
    while (e > 0) {
        if ((e % 2n) === 1n) {
            r = r * b % n;
        }
        e = e / 2n;
        b = b ** 2n % n;
    }
    return r;
}

function fromBuffer(buf) {
    let ret = 0n;
    for (const i of buf.values()) {
        const bi = BigInt(i);
        ret = (ret << 8n) + bi;
    }
    return ret;
}

/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()
 *
 * @param byteLength - The desired number of random bytes
 * @param forceLength - If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * byteLength MUST be > 0
 *
 * @returns A promise that resolves to a UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bytes
 */
function randBytes(byteLength, forceLength = false) {
    if (byteLength < 1)
        throw new RangeError('byteLength MUST be > 0');
    return new Promise(function (resolve, reject) {
        { // browser
            const buf = new Uint8Array(byteLength);
            self.crypto.getRandomValues(buf);
            // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
            if (forceLength)
                buf[0] = buf[0] | 128;
            resolve(buf);
        }
    });
}
/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param byteLength - The desired number of random bytes
 * @param forceLength - If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * byteLength MUST be > 0
 *
 * @returns A UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bytes
 */
function randBytesSync(byteLength, forceLength = false) {
    if (byteLength < 1)
        throw new RangeError('byteLength MUST be > 0');
    /* eslint-disable no-lone-blocks */
    { // browser
        const buf = new Uint8Array(byteLength);
        self.crypto.getRandomValues(buf);
        // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
        if (forceLength)
            buf[0] = buf[0] | 128;
        return buf;
    }
    /* eslint-enable no-lone-blocks */
}

/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param bitLength - The desired number of random bits
 * @param forceLength - If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * bitLength MUST be > 0
 *
 * @returns A Promise that resolves to a UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bits
 */
function randBits(bitLength, forceLength = false) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    const byteLength = Math.ceil(bitLength / 8);
    const bitLengthMod8 = bitLength % 8;
    return new Promise((resolve, reject) => {
        randBytes(byteLength, false).then(function (rndBytes) {
            if (bitLengthMod8 !== 0) {
                // Fill with 0's the extra bits
                rndBytes[0] = rndBytes[0] & (2 ** bitLengthMod8 - 1);
            }
            if (forceLength) {
                const mask = (bitLengthMod8 !== 0) ? 2 ** (bitLengthMod8 - 1) : 128;
                rndBytes[0] = rndBytes[0] | mask;
            }
            resolve(rndBytes);
        });
    });
}
/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * @param bitLength - The desired number of random bits
 * @param forceLength - If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * bitLength MUST be > 0
 *
 * @returns A Uint8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bits
 */
function randBitsSync(bitLength, forceLength = false) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    const byteLength = Math.ceil(bitLength / 8);
    const rndBytes = randBytesSync(byteLength, false);
    const bitLengthMod8 = bitLength % 8;
    if (bitLengthMod8 !== 0) {
        // Fill with 0's the extra bits
        rndBytes[0] = rndBytes[0] & (2 ** bitLengthMod8 - 1);
    }
    if (forceLength) {
        const mask = (bitLengthMod8 !== 0) ? 2 ** (bitLengthMod8 - 1) : 128;
        rndBytes[0] = rndBytes[0] | mask;
    }
    return rndBytes;
}

/**
 * Returns a cryptographically secure random integer between [min,max].
 * @param max Returned value will be <= max
 * @param min Returned value will be >= min
 *
 * @throws {RangeError}
 * Arguments MUST be: max > min
 *
 * @returns A cryptographically secure random bigint between [min,max]
 */
function randBetween(max, min = 1n) {
    if (max <= min)
        throw new RangeError('Arguments MUST be: max > min');
    const interval = max - min;
    const bitLen = bitLength(interval);
    let rnd;
    do {
        const buf = randBitsSync(bitLen);
        rnd = fromBuffer(buf);
    } while (rnd > interval);
    return rnd + min;
}

function _workerUrl(workerCode) {
    workerCode = `(() => {${workerCode}})()`; // encapsulate IIFE
    const _blob = new Blob([workerCode], { type: 'text/javascript' });
    return window.URL.createObjectURL(_blob);
}
let _useWorkers = false; // The following is just to check whether we can use workers
/* eslint-disable no-lone-blocks */
{ // Native JS
    if (self.Worker !== undefined)
        _useWorkers = true;
}

/**
 * The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
 * iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)
 *
 * @param w - A positive integer to be tested for primality
 * @param iterations - The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3
 * @param disableWorkers - Disable the use of workers for the primality test
 *
 * @throws {RangeError}
 * w MUST be >= 0
 *
 * @returns A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)
 */
function isProbablyPrime(w, iterations = 16, disableWorkers = false) {
    if (typeof w === 'number') {
        w = BigInt(w);
    }
    if (w < 0n)
        throw RangeError('w MUST be >= 0');
    { // browser
        return new Promise((resolve, reject) => {
            const worker = new Worker(_isProbablyPrimeWorkerUrl());
            worker.onmessage = (event) => {
                worker.terminate();
                resolve(event.data.isPrime);
            };
            worker.onmessageerror = (event) => {
                reject(event);
            };
            const msg = {
                rnd: w,
                iterations: iterations,
                id: 0
            };
            worker.postMessage(msg);
        });
    }
}
function _isProbablyPrime(w, iterations) {
    /*
    PREFILTERING. Even values but 2 are not primes, so don't test.
    1 is not a prime and the M-R algorithm needs w>1.
    */
    if (w === 2n)
        return true;
    else if ((w & 1n) === 0n || w === 1n)
        return false;
    /*
      Test if any of the first 250 small primes are a factor of w. 2 is not tested because it was already tested above.
      */
    const firstPrimes = [
        3n,
        5n,
        7n,
        11n,
        13n,
        17n,
        19n,
        23n,
        29n,
        31n,
        37n,
        41n,
        43n,
        47n,
        53n,
        59n,
        61n,
        67n,
        71n,
        73n,
        79n,
        83n,
        89n,
        97n,
        101n,
        103n,
        107n,
        109n,
        113n,
        127n,
        131n,
        137n,
        139n,
        149n,
        151n,
        157n,
        163n,
        167n,
        173n,
        179n,
        181n,
        191n,
        193n,
        197n,
        199n,
        211n,
        223n,
        227n,
        229n,
        233n,
        239n,
        241n,
        251n,
        257n,
        263n,
        269n,
        271n,
        277n,
        281n,
        283n,
        293n,
        307n,
        311n,
        313n,
        317n,
        331n,
        337n,
        347n,
        349n,
        353n,
        359n,
        367n,
        373n,
        379n,
        383n,
        389n,
        397n,
        401n,
        409n,
        419n,
        421n,
        431n,
        433n,
        439n,
        443n,
        449n,
        457n,
        461n,
        463n,
        467n,
        479n,
        487n,
        491n,
        499n,
        503n,
        509n,
        521n,
        523n,
        541n,
        547n,
        557n,
        563n,
        569n,
        571n,
        577n,
        587n,
        593n,
        599n,
        601n,
        607n,
        613n,
        617n,
        619n,
        631n,
        641n,
        643n,
        647n,
        653n,
        659n,
        661n,
        673n,
        677n,
        683n,
        691n,
        701n,
        709n,
        719n,
        727n,
        733n,
        739n,
        743n,
        751n,
        757n,
        761n,
        769n,
        773n,
        787n,
        797n,
        809n,
        811n,
        821n,
        823n,
        827n,
        829n,
        839n,
        853n,
        857n,
        859n,
        863n,
        877n,
        881n,
        883n,
        887n,
        907n,
        911n,
        919n,
        929n,
        937n,
        941n,
        947n,
        953n,
        967n,
        971n,
        977n,
        983n,
        991n,
        997n,
        1009n,
        1013n,
        1019n,
        1021n,
        1031n,
        1033n,
        1039n,
        1049n,
        1051n,
        1061n,
        1063n,
        1069n,
        1087n,
        1091n,
        1093n,
        1097n,
        1103n,
        1109n,
        1117n,
        1123n,
        1129n,
        1151n,
        1153n,
        1163n,
        1171n,
        1181n,
        1187n,
        1193n,
        1201n,
        1213n,
        1217n,
        1223n,
        1229n,
        1231n,
        1237n,
        1249n,
        1259n,
        1277n,
        1279n,
        1283n,
        1289n,
        1291n,
        1297n,
        1301n,
        1303n,
        1307n,
        1319n,
        1321n,
        1327n,
        1361n,
        1367n,
        1373n,
        1381n,
        1399n,
        1409n,
        1423n,
        1427n,
        1429n,
        1433n,
        1439n,
        1447n,
        1451n,
        1453n,
        1459n,
        1471n,
        1481n,
        1483n,
        1487n,
        1489n,
        1493n,
        1499n,
        1511n,
        1523n,
        1531n,
        1543n,
        1549n,
        1553n,
        1559n,
        1567n,
        1571n,
        1579n,
        1583n,
        1597n
    ];
    for (let i = 0; i < firstPrimes.length && (firstPrimes[i] <= w); i++) {
        const p = firstPrimes[i];
        if (w === p)
            return true;
        else if (w % p === 0n)
            return false;
    }
    /*
      1. Let a be the largest integer such that 2**a divides w−1.
      2. m = (w−1) / 2**a.
      3. wlen = len (w).
      4. For i = 1 to iterations do
          4.1 Obtain a string b of wlen bits from an RBG.
          Comment: Ensure that 1 < b < w−1.
          4.2 If ((b ≤ 1) or (b ≥ w−1)), then go to step 4.1.
          4.3 z = b**m mod w.
          4.4 If ((z = 1) or (z = w − 1)), then go to step 4.7.
          4.5 For j = 1 to a − 1 do.
          4.5.1 z = z**2 mod w.
          4.5.2 If (z = w−1), then go to step 4.7.
          4.5.3 If (z = 1), then go to step 4.6.
          4.6 Return COMPOSITE.
          4.7 Continue.
          Comment: Increment i for the do-loop in step 4.
      5. Return PROBABLY PRIME.
      */
    let a = 0n;
    const d = w - 1n;
    let aux = d;
    while (aux % 2n === 0n) {
        aux /= 2n;
        ++a;
    }
    const m = d / (2n ** a);
    do {
        const b = randBetween(d, 2n);
        let z = modPow(b, m, w);
        if (z === 1n || z === d)
            continue;
        let j = 1;
        while (j < a) {
            z = modPow(z, 2n, w);
            if (z === d)
                break;
            if (z === 1n)
                return false;
            j++;
        }
        if (z !== d)
            return false;
    } while (--iterations !== 0);
    return true;
}
function _isProbablyPrimeWorkerUrl() {
    // Let's us first add all the required functions
    let workerCode = `'use strict';const ${eGcd.name}=${eGcd.toString()};const ${modInv.name}=${modInv.toString()};const ${modPow.name}=${modPow.toString()};const ${toZn.name}=${toZn.toString()};const ${randBitsSync.name}=${randBitsSync.toString()};const ${randBytesSync.name}=${randBytesSync.toString()};const ${randBetween.name}=${randBetween.toString()};const ${isProbablyPrime.name}=${_isProbablyPrime.toString()};${bitLength.toString()};${fromBuffer.toString()};`;
    workerCode += `onmessage=async function(_e){const _m={isPrime:await ${isProbablyPrime.name}(_e.data.rnd,_e.data.iterations),value:_e.data.rnd,id:_e.data.id};postMessage(_m);}`;
    return _workerUrl(workerCode);
}

/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
 * The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI
 * main process, and it can be much faster (if several cores or cpu are available).
 * The node version can also use worker_threads if they are available (enabled by default with Node 11 and
 * and can be enabled at runtime executing node --experimental-worker with node >=10.5.0).
 *
 * @param bitLength - The required bit length for the generated prime
 * @param iterations - The number of iterations for the Miller-Rabin Probabilistic Primality Test
 *
 * @throws {RangeError}
 * bitLength MUST be > 0
 *
 * @returns A promise that resolves to a bigint probable prime of bitLength bits.
 */
function prime(bitLength, iterations = 16) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    /* istanbul ignore if */
    if (!_useWorkers) { // If there is no support for workers
        let rnd = 0n;
        do {
            rnd = fromBuffer(randBitsSync(bitLength, true));
        } while (!_isProbablyPrime(rnd, iterations));
        return new Promise((resolve) => { resolve(rnd); });
    }
    return new Promise((resolve, reject) => {
        const workerList = [];
        const _onmessage = (msg, newWorker) => {
            if (msg.isPrime) {
                // if a prime number has been found, stop all the workers, and return it
                for (let j = 0; j < workerList.length; j++) {
                    workerList[j].terminate();
                }
                while (workerList.length > 0) {
                    workerList.pop();
                }
                resolve(msg.value);
            }
            else { // if a composite is found, make the worker test another random number
                const buf = randBitsSync(bitLength, true);
                const rnd = fromBuffer(buf);
                try {
                    const msgToWorker = {
                        rnd: rnd,
                        iterations: iterations,
                        id: msg.id
                    };
                    newWorker.postMessage(msgToWorker);
                }
                catch (error) {
                    // The worker has already terminated. There is nothing to handle here
                }
            }
        };
        { // browser
            const workerURL = _isProbablyPrimeWorkerUrl();
            for (let i = 0; i < self.navigator.hardwareConcurrency - 1; i++) {
                const newWorker = new Worker(workerURL);
                newWorker.onmessage = (event) => _onmessage(event.data, newWorker);
                workerList.push(newWorker);
            }
        }
        for (let i = 0; i < workerList.length; i++) {
            randBits(bitLength, true).then(function (buf) {
                const rnd = fromBuffer(buf);
                workerList[i].postMessage({
                    rnd: rnd,
                    iterations: iterations,
                    id: i
                });
            }).catch(reject);
        }
    });
}

/**
 * Converts a non-negative bigint to a hexadecimal string
 * @param a - a non negative bigint
 * @returns hexadecimal representation of the input bigint
 *
 * @throws {RangeError}
 * Thrown if a < 0
 */
function bigintToHex(a) {
    if (a < 0)
        throw RangeError('a should be a non-negative integer. Negative values are not supported');
    return a.toString(16);
}

class RsaPrivateKey {
    constructor(d, n) {
        this.d = d;
        this.n = n;
    }
    decrypt(c) {
        return modPow(c, this.d, this.n);
    }
    sign(m) {
        return modPow(m, this.d, this.n);
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
        return modPow(m, this.e, this.n);
    }
    verify(s) {
        return modPow(s, this.e, this.n);
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
            e: bigintToHex(this.e),
            n: bigintToHex(this.n)
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
    return gcd(a, b) === exp;
}
function genE(mcm, nbits) {
    let e = randBetween(mcm, BigInt(1));
    while (!isCoprime(e, mcm)) {
        e = randBetween(mcm, BigInt(1));
    }
    return e;
}
async function generateKeys(bitLength$1 = 2048) {
    let e = 0n;
    let p = 0n;
    let q = 0n;
    let n = 0n;
    let phi = 0n;
    do {
        p = await prime(bitLength$1 / 2 + 1);
        q = await prime(bitLength$1 / 2);
        n = p * q;
        phi = (p - 1n) * (q - 1n);
        const mcm = lcm(p - BigInt(1), q - BigInt(1));
        e = await genE(mcm);
    } while (bitLength(n) !== bitLength$1 || (phi % e === 0n) || q === p);
    const publicKey = new RsaPublicKey(e, n);
    const d = modInv(e, phi);
    const privKey = new RsaPrivateKey(d, n);
    const keys = new RsaKeyPair(publicKey, privKey);
    return keys;
}

export { RsaKeyPair, RsaPrivateKey, RsaPublicKey, generateKeys };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvYmlnaW50LWNyeXB0by11dGlscy9kaXN0L2VzbS9pbmRleC5icm93c2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JpZ2ludC1jb252ZXJzaW9uL2Rpc3QvZXNtL2luZGV4LmJyb3dzZXIuanMiLCIuLi8uLi9zcmMvdHMvcnNhLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJiY3UubW9kUG93IiwiYmMuYmlnaW50VG9IZXgiLCJiY3UuZ2NkIiwiYmN1LnJhbmRCZXR3ZWVuIiwiYml0TGVuZ3RoIiwiYmN1LnByaW1lIiwiYmN1LmxjbSIsImJjdS5iaXRMZW5ndGgiLCJiY3UubW9kSW52Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNoQixJQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDdEIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7QUFDN0IsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFO0FBQ2xCLFFBQVEsT0FBTyxDQUFDLENBQUM7QUFDakIsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksR0FBRztBQUNQLFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDZixLQUFLLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtBQUM5QixJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFDRDtBQUNBO0FBQ0E7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QUFRLEdBQUc7QUFDWCxRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLElBQUk7QUFDWixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixRQUFRLEtBQUs7QUFDYixLQUFLLENBQUM7QUFDTixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxRSxRQUFRLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbkIsWUFBWSxPQUFPLElBQUksQ0FBQztBQUN4QixhQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO0FBQzdCLFlBQVksT0FBTyxLQUFLLENBQUM7QUFDekIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBSSxPQUFPLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQzVCLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQztBQUNsQixRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ1osS0FBSztBQUNMLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1QixJQUFJLEdBQUc7QUFDUCxRQUFRLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckMsUUFBUSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMvQixZQUFZLFNBQVM7QUFDckIsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdEIsWUFBWSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZCLGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN4QixnQkFBZ0IsT0FBTyxLQUFLLENBQUM7QUFDN0IsWUFBWSxDQUFDLEVBQUUsQ0FBQztBQUNoQixTQUFTO0FBQ1QsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ25CLFlBQVksT0FBTyxLQUFLLENBQUM7QUFDekIsS0FBSyxRQUFRLEVBQUUsVUFBVSxLQUFLLENBQUMsRUFBRTtBQUNqQyxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFDRCxTQUFTLHlCQUF5QixHQUFHO0FBQ3JDO0FBQ0EsSUFBSSxJQUFJLFVBQVUsR0FBRyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JkLElBQUksVUFBVSxJQUFJLENBQUMscURBQXFELEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO0FBQ3BMLElBQUksT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUU7QUFDM0MsSUFBSSxJQUFJLFNBQVMsR0FBRyxDQUFDO0FBQ3JCLFFBQVEsTUFBTSxJQUFJLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3REO0FBQ0EsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsR0FBRztBQUNYLFlBQVksR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUQsU0FBUyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFO0FBQ3JELFFBQVEsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzRCxLQUFLO0FBQ0wsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSztBQUM1QyxRQUFRLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM5QixRQUFRLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsS0FBSztBQUMvQyxZQUFZLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUM3QjtBQUNBLGdCQUFnQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1RCxvQkFBb0IsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzlDLGlCQUFpQjtBQUNqQixnQkFBZ0IsT0FBTyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM5QyxvQkFBb0IsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLGlCQUFpQjtBQUNqQixnQkFBZ0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxhQUFhO0FBQ2IsaUJBQWlCO0FBQ2pCLGdCQUFnQixNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFELGdCQUFnQixNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUMsZ0JBQWdCLElBQUk7QUFDcEIsb0JBQW9CLE1BQU0sV0FBVyxHQUFHO0FBQ3hDLHdCQUF3QixHQUFHLEVBQUUsR0FBRztBQUNoQyx3QkFBd0IsVUFBVSxFQUFFLFVBQVU7QUFDOUMsd0JBQXdCLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUNsQyxxQkFBcUIsQ0FBQztBQUN0QixvQkFBb0IsU0FBUyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN2RCxpQkFBaUI7QUFDakIsZ0JBQWdCLE9BQU8sS0FBSyxFQUFFO0FBQzlCO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTLENBQUM7QUFDVixRQUFRO0FBQ1IsWUFBWSxNQUFNLFNBQVMsR0FBRyx5QkFBeUIsRUFBRSxDQUFDO0FBQzFELFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdFLGdCQUFnQixNQUFNLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN4RCxnQkFBZ0IsU0FBUyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssS0FBSyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRixnQkFBZ0IsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQyxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDcEQsWUFBWSxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUMxRCxnQkFBZ0IsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLGdCQUFnQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQzFDLG9CQUFvQixHQUFHLEVBQUUsR0FBRztBQUM1QixvQkFBb0IsVUFBVSxFQUFFLFVBQVU7QUFDMUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDO0FBQ3pCLGlCQUFpQixDQUFDLENBQUM7QUFDbkIsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFNBQVM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQOztBQ2h4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLENBQUMsRUFBRTtBQUN4QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDYixRQUFRLE1BQU0sVUFBVSxDQUFDLHVFQUF1RSxDQUFDLENBQUM7QUFDbEcsSUFBSSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUI7O01DckRhLGFBQWEsQ0FBQTtJQUd4QixXQUFhLENBQUEsQ0FBUyxFQUFFLENBQVMsRUFBQTtBQUMvQixRQUFBLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ1YsUUFBQSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNYO0FBRU0sSUFBQSxPQUFPLENBQUUsQ0FBUyxFQUFBO0FBQ3ZCLFFBQUEsT0FBT0EsTUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQztBQUVNLElBQUEsSUFBSSxDQUFFLENBQVMsRUFBQTtBQUNwQixRQUFBLE9BQU9BLE1BQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckM7QUFRRixDQUFBO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7TUFFYSxZQUFZLENBQUE7SUFJdkIsV0FBYSxDQUFBLENBQVMsRUFBRSxDQUFTLEVBQUE7QUFDL0IsUUFBQSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNWLFFBQUEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDWDtBQUVNLElBQUEsT0FBTyxDQUFFLENBQVMsRUFBQTtBQUN2QixRQUFBLE9BQU9BLE1BQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckM7QUFFTSxJQUFBLE1BQU0sQ0FBRSxDQUFTLEVBQUE7QUFDdEIsUUFBQSxPQUFPQSxNQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3JDOzs7Ozs7Ozs7SUFXTSxZQUFZLEdBQUE7UUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3BCLENBQUMsRUFBRUMsV0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQyxFQUFFQSxXQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxQixTQUFBLENBQUMsQ0FBQTtLQUNIO0FBQ0YsQ0FBQTtBQUVEO0FBQ0E7QUFDQTtBQUNBO01BRWEsVUFBVSxDQUFBO0lBSXJCLFdBQWEsQ0FBQSxTQUF1QixFQUFFLFVBQXlCLEVBQUE7QUFDN0QsUUFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0tBQzdCO0FBQ0YsQ0FBQTtBQUVELFNBQVMsU0FBUyxDQUFFLENBQVMsRUFBRSxDQUFTLEVBQUE7QUFDdEMsSUFBQSxNQUFNLEdBQUcsR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDN0IsT0FBT0MsR0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUE7QUFDOUIsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFFLEdBQVcsRUFBRSxLQUFhLEVBQUE7QUFDdkMsSUFBQSxJQUFJLENBQUMsR0FBV0MsV0FBZSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvQyxJQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLFFBQUEsQ0FBQyxHQUFHQSxXQUFlLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3BDLEtBQUE7QUFFRCxJQUFBLE9BQU8sQ0FBQyxDQUFBO0FBQ1YsQ0FBQztBQUVNLGVBQWUsWUFBWSxDQUFFQyxXQUFTLEdBQUcsSUFBSSxFQUFBO0lBQ2xELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUNWLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQTtJQUNoRCxHQUFHO0FBQ0QsUUFBQSxDQUFDLEdBQUcsTUFBTUMsS0FBUyxDQUFDRCxXQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3RDLENBQUMsR0FBRyxNQUFNQyxLQUFTLENBQUNELFdBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxRQUFBLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ1QsUUFBQSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUN6QixNQUFNLEdBQUcsR0FBV0UsR0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3pELENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFjLENBQUMsQ0FBQTtLQUMvQixRQUFRQyxTQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUtILFdBQVMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUM7SUFFdkUsTUFBTSxTQUFTLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRXhDLE1BQU0sQ0FBQyxHQUFHSSxNQUFVLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBRTVCLE1BQU0sT0FBTyxHQUFHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUV2QyxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFFL0MsSUFBQSxPQUFPLElBQUksQ0FBQTtBQUNiOzs7OyJ9
