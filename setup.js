// Sets up the database: DB_DATABASE (created if it isn't there), with the tables
// of schema.sql. Running it again keeps the links and views.
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// The database settings, from the PM2 file
const { env } = require("./ecosystem.config.cjs").apps[0];

const connect = async (database) => {
  const client = new Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database,
  });
  await client.connect();
  return client;
};

const setup = async () => {
  const admin = await connect("postgres");
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [env.DB_DATABASE]);
  if (exists.rowCount === 0) await admin.query(`CREATE DATABASE "${env.DB_DATABASE}"`);
  await admin.end();

  const db = await connect(env.DB_DATABASE);
  await db.query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
  const links = await db.query("SELECT count(*) FROM urls");
  const index = await db.query("SELECT count(*) FROM pg_indexes WHERE indexname = 'urls_code_index'");
  await db.end();

  console.log(
    `[url-shortener] ${env.DB_DATABASE} is ready: ${links.rows[0].count} links, ${index.rows[0].count === "1" ? "with" : "no"} index on code`
  );
};

setup();
