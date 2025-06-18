function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

document.getElementById("register").addEventListener("click", async () => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  try {
    const publicKey = {
      challenge,
      rp: {
        name: "Secure QR App"
      },
      user: {
        id: new Uint8Array(16), // dummy user ID
        name: "user@example.com",
        displayName: "Secure QR User"
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "none"
    };

    const credential = await navigator.credentials.create({ publicKey });

    const rawId = credential.rawId;
    const encoded = base64urlEncode(rawId);

    document.getElementById("output").textContent = encoded;

    console.log("Credential ID (base64url):", encoded);
    alert("Credential registered. Copy it into keys.js manually.");
  } catch (err) {
    console.error("Registration failed:", err);
    alert("Registration failed: " + err.message);
  }
});
