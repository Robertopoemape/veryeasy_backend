const express = require("express");
const crypto = require("crypto");
const fetch = require("node-fetch");
const {
  generateCodeVerifier,
  generateCodeChallenge,
} = require("../utils/pkce");

const router = express.Router();
const store = {};

// 1) Inicia el flujo OAuth PKCE
router.get("/start", (req, res) => {
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  store[req.ip] = verifier;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CANVA_CLIENT_ID,
    redirect_uri: process.env.CANVA_REDIRECT_URI,
    scope: "asset:read asset:write design:read design:write",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: crypto.randomBytes(16).toString("hex"),
  });

  res.redirect(`https://www.canva.com/api/oauth/authorize?${params}`);
});

// 2) Callback: intercambia code por tokens
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const verifier = store[req.ip];
  if (!code || !verifier)
    return res.status(400).send("Missing code or verifier");

  try {
    const tokenRes = await fetch("https://api.canva.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.CANVA_REDIRECT_URI,
        client_id: process.env.CANVA_CLIENT_ID,
        client_secret: process.env.CANVA_CLIENT_SECRET,
        code_verifier: verifier,
      }),
    });
    const data = await tokenRes.json();
    console.log("Tokens Canva:", data);
    res.send("✔️ Autenticación completada. Revisa los logs.");
  } catch (err) {
    console.error("Error en /auth/callback:", err);
    res.status(500).send("Error autenticando con Canva");
  }
});

module.exports = router;
