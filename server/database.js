const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "url_shortener"
});

const DB = {};

DB.find = query => {
  return new Promise(function(resolve, reject) {
    connection.query(query, function(error, results) {
      if (error) {
        reject("An unkown error ocurred.");
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
        reject("An unkown error ocurred.");
      }
      resolve();
    });
  });
};

module.exports = DB;
