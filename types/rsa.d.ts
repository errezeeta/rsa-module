export declare class RsaPrivateKey {
    readonly d: bigint;
    readonly n: bigint;
    constructor(d: bigint, n: bigint);
    decrypt(c: bigint): bigint;
    sign(m: bigint): bigint;
}
export declare class RsaPublicKey {
    readonly e: bigint;
    readonly n: bigint;
    constructor(e: bigint, n: bigint);
    encrypt(m: bigint): bigint;
    verify(s: bigint): bigint;
    toJsonString(): string;
}
export declare class RsaKeyPair {
    readonly publicKey: RsaPublicKey;
    readonly privateKey: RsaPrivateKey;
    constructor(publicKey: RsaPublicKey, privateKey: RsaPrivateKey);
}
export declare function generateKeys(bitLength?: number): Promise<RsaKeyPair>;
//# sourceMappingURL=rsa.d.ts.map