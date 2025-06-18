import { decryptText } from './crypto.js';
import { allowedCredentials } from './keys.js';

async function authenticate() {
  const cred = await navigator.credentials.get({
    publicKey: {
      challenge: new Uint8Array([1, 2, 3, 4]),
      allowCredentials: allowedCredentials,
      timeout: 60000,
      userVerification: "required"
    }
  });
  return !!cred;
}

async function start() {
  const hash = location.hash.slice(1);
  if (!hash) {
    document.getElementById("result").innerText = "No data in URL.";
    return;
  }

  try {
    const payload = JSON.parse(atob(hash));
    const authOK = await authenticate();
    if (!authOK) throw new Error("Authentication failed");

    const plaintext = await decryptText(payload.ciphertext);
    document.getElementById("result").innerText =
      `Container ID: ${payload.id}\nContents: ${plaintext}`;
  } catch (err) {
    document.getElementById("result").innerText = "Error: " + err.message;
  }
}

document.addEventListener("DOMContentLoaded", start);
