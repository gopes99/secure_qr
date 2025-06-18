import { encryptText } from './crypto.js';

function toUrlSafeBase64(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

document.getElementById('generate').addEventListener('click', async () => {
  const id = document.getElementById('container_id').value.trim();
  const contents = document.getElementById('contents').value.trim();

  if (!id || !contents) {
    alert("Please fill in both Container ID and Contents.");
    return;
  }

  try {
    const ciphertext = await encryptText(contents);
    const data = JSON.stringify({ id, ciphertext });
    const encoded = toUrlSafeBase64(data);
    const qrUrl = `${location.origin}${location.pathname.replace('index.html', 'view.html')}#${encoded}`;

    const canvas = document.getElementById('qr');
    await QRCode.toCanvas(canvas, qrUrl, {
      width: 300,
      errorCorrectionLevel: 'H'
    });

    // Download automatically
    const link = document.createElement('a');
    link.download = `${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    // Show label
    document.getElementById('label').innerText = `Container ID: ${id}`;
  } catch (err) {
    console.error("Encryption or QR generation failed:", err);
    alert("Something went wrong.");
  }
});
