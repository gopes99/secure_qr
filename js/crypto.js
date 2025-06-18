const keyMask = Uint8Array.from([123, 200, 44, 55, 66, 78, 99, 101, 111, 120, 18, 32, 21, 65, 11, 88, 44, 199, 8, 92, 12, 4, 76, 59, 91, 67, 99, 120, 129, 33, 5, 79]);
const obfuscatedKey = "f3nFbA0XHUkSRiZueGtdURgFEyg9Kg==";

function xorBuffer(buf1, buf2) {
  return buf1.map((b, i) => b ^ buf2[i]);
}

async function getKey() {
  const rawKey = xorBuffer(Uint8Array.from(atob(obfuscatedKey), c => c.charCodeAt(0)), keyMask);
  return crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptText(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return btoa([...iv, ...new Uint8Array(ciphertext)].map(b => String.fromCharCode(b)).join(''));
}

export async function decryptText(b64data) {
  const data = Uint8Array.from(atob(b64data), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const ct = data.slice(12);
  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(decrypted);
}