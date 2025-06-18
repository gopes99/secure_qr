import { decryptText } from './crypto.js';
import { allowedCredentials } from './keys.js';
<script src="https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js"></script>
async function authenticate() {
  const cred = await navigator.credentials.get({
    publicKey: {
      challenge: new Uint8Array([1, 2, 3, 4]), // dummy challenge
      allowCredentials: allowedCredentials,
      timeout: 60000,
      userVerification: "required"
    }
  });
  return !!cred;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const code = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);

      if (!code) {
        document.getElementById("result").innerText = "No QR code detected.";
        return;
      }

      try {
        const authOK = await authenticate();
        if (!authOK) throw new Error("Auth failed");

        const payload = JSON.parse(code.data);
        const plaintext = await decryptText(payload.ciphertext);
        document.getElementById("result").innerText = `Container ID: ${payload.id}\nContents: ${plaintext}`;
      } catch (err) {
        document.getElementById("result").innerText = "Authentication or decryption failed.";
      }
    };
    img.src = URL.createObjectURL(file);
  });
});
