const mysql = require("mysql");
const keys = require("./config/keys");

// Connect to the database
let connection = mysql.createConnection({
  host: keys.mysqlHost,
  user: keys.mysqlUser,
  database: keys.mysqlDatabase,
  password: keys.mysqlPassword,
  port: keys.mysqlPort
});

// Create the urls table
connection.query(
  `CREATE TABLE IF NOT EXISTS urls (
     id INTEGER AUTO_INCREMENT PRIMARY KEY,
     real_url TEXT NOT NULL,
     shortened_url_id VARCHAR(100) NOT NULL UNIQUE,
     created_at TIMESTAMP DEFAULT NOW() NOT NULL,
     user_id INT,
     views INTEGER DEFAULT 0 NOT NULL,
     FOREIGN KEY(user_id) REFERENCES users(id)
   );`,
  function(err, result) {
    if (err) throw err;
  }
);

// Create user table
connection.query(
  `CREATE TABLE IF NOT EXISTS users (
     id INTEGER AUTO_INCREMENT PRIMARY KEY,
     google_id VARCHAR(200) NOT NULL,
     email VARCHAR(200) NOT NULL UNIQUE,
     name VARCHAR(200) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW() NOT NULL
   );`,
  function(err, result) {
    if (err) throw err;
  }
);

const DB = {};

// Fetch from the database, returns an array if there were more than one
// record or an object if there was only one record
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

// Insert an item to a specified table
DB.insert = (table, data) => {
  return new Promise(function(resolve, reject) {
    const query = `INSERT INTO ${table} SET ?`;
    connection.query(query, data, function(error, result) {
      if (error) {
        reject(error);
      }
      resolve(result.insertId);
    });
  });
};

// Update an item in the database
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

module.exports = { DB, connection };
