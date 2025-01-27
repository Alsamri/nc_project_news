const db = require("./db/connection.js");

exports.alltopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};
