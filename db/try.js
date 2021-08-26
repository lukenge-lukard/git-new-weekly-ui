var mysql2 = require('mysql2/promise');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: 3306,
    user: 'db_user',
    password: 'password',
    database: 'db_name'
};

var connection = mysql2.createPool(options);
var sessionStore = new MySQLStore({}/* session store options */, connection);
