const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "url_shortener"
});

const sql = `CREATE TABLE IF NOT EXISTS urls (
   id INTEGER AUTO_INCREMENT PRIMARY KEY,
   real_url TEXT NOT NULL,
   shortened_url_id VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP DEFAULT NOW() NOT NULL,
   views INTEGER DEFAULT 0 NOT NULL
 );`;
connection.query(sql, function(err, result) {
  if (err) throw err;
});

const DB = {};

DB.find = query => {
  return new Promise(function(resolve, reject) {
    connection.query(query, function(error, results) {
      if (error) {
        reject(error);
      } else {
        if (results.length === 1) {
          resolve(results[0]);
        } else {
          resolve(results);
        }
      }
    });
  });
};

DB.insert = (table, data) => {
  return new Promise(function(resolve, reject) {
    const query = `INSERT INTO ${table} SET ?`;
    connection.query(query, data, function(error, result) {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};

DB.update = (sql, data) => {
  return new Promise(function(resolve, reject) {
    connection.query(sql, data, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};

module.exports = DB;
