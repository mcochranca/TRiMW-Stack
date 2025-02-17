use pqcrypto_kyber::kyber512::*;
use pqcrypto_dilithium::dilithium2::*;
use wasm_bindgen::prelude::*;
use pqcrypto_traits::sign::{Signer, Verifier};

#[wasm_bindgen]
pub fn generate_kyber_keys() -> JsValue {
    // Generate a Kyber512 keypair
    let (pk, sk) = keypair();
    // Convert keys to byte vectors and then to JS-friendly format
    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &JsValue::from_str("publicKey"), &JsValue::from_serde(&pk.as_bytes().to_vec()).unwrap()).unwrap();
    js_sys::Reflect::set(&result, &JsValue::from_str("secretKey"), &JsValue::from_serde(&sk.as_bytes().to_vec()).unwrap()).unwrap();
    JsValue::from(result)
}

#[wasm_bindgen]
pub fn encapsulate(public_key_bytes: &[u8]) -> JsValue {
    // Reconstruct public key from bytes
    let pk = PublicKey::from_bytes(public_key_bytes).expect("Invalid public key bytes");
    let (ciphertext, shared_secret) = encapsulate(&pk);
    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &JsValue::from_str("ciphertext"), &JsValue::from_serde(&ciphertext.as_bytes().to_vec()).unwrap()).unwrap();
    js_sys::Reflect::set(&result, &JsValue::from_str("sharedSecret"), &JsValue::from_serde(&shared_secret.as_bytes().to_vec()).unwrap()).unwrap();
    JsValue::from(result)
}

#[wasm_bindgen]
pub fn decapsulate(secret_key_bytes: &[u8], ciphertext_bytes: &[u8]) -> JsValue {
    let sk = SecretKey::from_bytes(secret_key_bytes).expect("Invalid secret key bytes");
    let ct = Ciphertext::from_bytes(ciphertext_bytes).expect("Invalid ciphertext bytes");
    let shared_secret = decapsulate(&ct, &sk);
    JsValue::from_serde(&shared_secret.as_bytes().to_vec()).unwrap()
}

#[wasm_bindgen]
pub fn sign_message(message: &[u8], secret_key_bytes: &[u8]) -> JsValue {
    let sk = SecretKey::from_bytes(secret_key_bytes).expect("Invalid secret key bytes");
    let signature = sign(message, &sk);
    JsValue::from_serde(&signature.as_bytes().to_vec()).unwrap()
}

#[wasm_bindgen]
pub fn verify_signature(message: &[u8], signature_bytes: &[u8], public_key_bytes: &[u8]) -> bool {
    let pk = PublicKey::from_bytes(public_key_bytes).expect("Invalid public key bytes");
    let sig = Signature::from_bytes(signature_bytes).expect("Invalid signature bytes");
    verify(message, &sig, &pk).is_ok()
}

