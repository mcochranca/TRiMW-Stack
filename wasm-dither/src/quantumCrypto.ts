// lib/quantumCrypto.ts
import init, { generate_kyber_keys, encapsulate, decapsulate, sign_message, verify_signature } from '../wasm/crypto_pkg';

export async function setupQuantumKeys() {
    await init();
    const keys = generate_kyber_keys();
    return keys; // Returns an object with publicKey and secretKey arrays
}

export function encapsulateKey(publicKey: Uint8Array) {
    return encapsulate(publicKey);
}

export function decapsulateKey(secretKey: Uint8Array, ciphertext: Uint8Array) {
    return decapsulate(secretKey, ciphertext);
}

export function signData(message: Uint8Array, secretKey: Uint8Array) {
    return sign_message(message, secretKey);
}

export function verifyData(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array) {
    return verify_signature(message, signature, publicKey);
}

