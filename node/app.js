const express = require("express");
const pool = require("./db");
const { logRequests } = require("./logger");

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const app = express();

app.use(logRequests);
app.use(express.json());

// A random 7-character code
const generateCode = () => {
  let code = "";
  for (let i = 0; i < 7; i++) code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return code;
};

app.post("/url", async (req, res) => {
  if (!req.body?.url) return res.status(400).json({ error: "url is required" });

  const code = generateCode();
  await pool.query("INSERT INTO urls (code, url) VALUES ($1, $2)", [code, req.body.url]);

  res.json({ code });
});

app.get("/:code", async (req, res) => {
  const { rows } = await pool.query("SELECT id, url FROM urls WHERE code = $1", [req.params.code]);
  if (rows.length === 0) return res.status(404).send("Not found");

  await pool.query("INSERT INTO views (url_id, ip_address, user_agent, referrer) VALUES ($1, $2, $3, $4)", [
    rows[0].id,
    req.ip,
    req.get("user-agent"),
    req.get("referer"),
  ]);

  res.redirect(rows[0].url);
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
