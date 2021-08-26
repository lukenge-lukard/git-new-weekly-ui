const path = require("path");
const fs = require("fs");
const mysql = require("mysql8");

const MYSQL_CONFIG = {
  host: "yammie-db-secure-do-user-8336351-0.b.db.ondigitalocean.com",
  user: "campusadmin",
  password: "mo0vbef2x3u2f7pm",
  database: "campus_weekly",
  port: 25060,
  // ssl: {
  //   ca: fs.readFileSync(path.join(__dirname, "ca.crt")),
  // },
  // host             : process.env.DATABASE_HOST,
  // user             : process.env.DATABASE_USER,
  // password         : process.env.DATABASE_PASSWORD,
  // database         : process.env.DATABASE,
  // port             : process.env.DATABASE_PORT, 
  ssl  : {
    ca : fs.readFileSync(path.join(__dirname, "../ca-certificate.crt"))
  }
};

// const pool = mysql.createPool({
//   connectionLimit  : 10,
//   host             : process.env.DATABASE_HOST,
//   user             : process.env.DATABASE_USER,
//   password         : process.env.DATABASE_PASSWORD,
//   database         : process.env.DATABASE,
//   port             : process.env.DATABASE_PORT,  
//   ssl  : {
//       ca : fs.readFileSync(path.join(__dirname, "../ca-certificate.crt"))
//       // ca : fs.readFileSync(__dirname + '/ca-certificate.crt')
//     } 
// });

const conn = mysql.createConnection(MYSQL_CONFIG);
conn.connect((err) => {
  if (err) throw err;
  console.log("Database connected....");
});

module.exports = conn;
// module.exports = MYSQL_CONFIG;