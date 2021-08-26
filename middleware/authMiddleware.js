const jwt = require('jsonwebtoken');
const conn = require("../db/db.js");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
          conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rowss) => {
            if(!err){
                console.log("User acquired...");
                // console.log(rows[0]);
                exports.rowData = 2;
            } else{
                console.log(err);
            }
        });
        
        next();
      }
    });

  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };