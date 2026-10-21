const os = require("os");
const { Pool } = require("pg");

// The workers (one per core) share the DB_POOL_SIZE connections
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  max: Math.max(1, Math.floor(process.env.DB_POOL_SIZE / os.availableParallelism())),
});

module.exports = pool;
