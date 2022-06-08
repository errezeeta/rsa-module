export declare class RsaPrivateKey {
    private readonly d;
    private readonly n;
    constructor(d: bigint, n: bigint);
    decrypt(c: bigint): bigint;
    sign(m: bigint): bigint;
}
export declare class RsaPublicKey {
    private readonly e;
    private readonly n;
    constructor(e: bigint, n: bigint);
    encrypt(m: bigint): bigint;
    verify(s: bigint): bigint;
    toJsonString(): string;
}
declare class RsaKeyPair {
    private readonly publicKey;
    private readonly privateKey;
    constructor(publicKey: RsaPublicKey, privateKey: RsaPrivateKey);
}
export declare function generateKeys(bitLength?: number): Promise<RsaKeyPair>;
export {};
//# sourceMappingURL=rsa.d.ts.map