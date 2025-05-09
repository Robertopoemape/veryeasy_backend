const crypto = require("crypto");

function generateCodeVerifier() {
  return crypto.randomBytes(64).toString("base64url");
}

function generateCodeChallenge(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

module.exports = { generateCodeVerifier, generateCodeChallenge };
