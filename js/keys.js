export const allowedCredentials = [
  {
    type: "public-key",
    id: Uint8Array.from(atob("BASE64ENCODEDCREDENTIALID"), c => c.charCodeAt(0)),
    transports: ["internal"]
  }
];
