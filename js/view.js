import { decryptText } from './crypto.js';
import { authenticate } from './webauthn.js';
import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.mjs";

document.getElementById("qrFile").onchange = async (e) => {
  const file = e.target.files[0];
  const img = new Image();
  const reader = new FileReader();

  reader.onload = () => {
    img.src = reader.result;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (!code) return alert("QR code not found.");

      const payload = JSON.parse(code.data);
      if (!payload.id || !payload.ciphertext) return alert("Invalid QR format.");

      authenticate().then(async () => {
        const decrypted = await decryptText(payload.ciphertext);
        document.getElementById("output").value = decrypted;
      }).catch(() => alert("Authentication failed."));
    };
  };
  reader.readAsDataURL(file);
};