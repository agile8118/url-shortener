// The URL shortener: Express in cluster mode (one worker for every core) or the Go binary (one
// process, which uses every core on its own).

// The port, and the PostgreSQL to use (setup.js reads it from here too)
const env = {
  PORT: "2080",
  DB_USER: "postgres", // change this to your PostgreSQL username
  DB_HOST: "localhost",
  DB_DATABASE: "url-shortener",
  DB_PASSWORD: "",
  DB_PORT: "5432",
  DB_POOL_SIZE: "200", // connections in total (Express splits them over its workers), under PostgreSQL's max_connections
};

module.exports = {
  apps: [
    {
      name: "url-shortener",
      script: "node/app.js",
      cwd: __dirname,
      instances: "max",
      exec_mode: "cluster",
      env,
    },
    {
      name: "url-shortener-go",
      script: "go/url-shortener",
      interpreter: "none",
      cwd: __dirname,
      env,
    },
  ],
};
