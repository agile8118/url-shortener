-- The tables: the links and one row for every visit. setup.js runs this file.

CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CREATE UNIQUE INDEX IF NOT EXISTS urls_code_index ON urls (code);

CREATE TABLE IF NOT EXISTS views (
  id SERIAL PRIMARY KEY,
  url_id INT NOT NULL REFERENCES urls (id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
