const path = require("path");
const fs = require("fs");
const mysql = require("mysql8");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const MYSQL_CONFIG = {
  host             : process.env.DATABASE_HOST,
  user             : process.env.DATABASE_USER,
  password         : process.env.DATABASE_PASSWORD,
  database         : process.env.DATABASE,
  port             : process.env.DATABASE_PORT, 
  ssl  : {
    ca : fs.readFileSync(path.join(__dirname, "../ca-certificate.crt"))
  }
};

const conn = mysql.createConnection(MYSQL_CONFIG);
conn.connect((err) => {
  if (err) throw err;
  console.log("Database connected....");
});

module.exports = conn;