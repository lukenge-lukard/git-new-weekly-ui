const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const exphbs = require('express-handlebars');
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

const app = express();

const TWO_HOURS = 1000 * 60 * 60 * 24;

const {
    PORT = 3200,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET= 'ssh!quiet,it\'asecret!',
    SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';


// const PORT = process.env.PORT || 3200;
dotenv.config({ path: "./.env" });

// Connection Pool
const pool = mysql.createPool({
    // connectionLimit  : 10,
    host             : process.env.DATABASE_HOST,
    user             : process.env.DATABASE_USER,
    password         : process.env.DATABASE_PASSWORD,
    database         : process.env.DATABASE,
    port             : process.env.DATABASE_PORT,    
});

//addition from sess-auth
app.use(bodyParser.urlencoded({
    extended: true
}));

var options = {
    host             : process.env.DATABASE_HOST,
    user             : process.env.DATABASE_USER,
    password         : process.env.DATABASE_PASSWORD,
    database         : process.env.DATABASE,
};

var sessionStore = new MySQLStore(options);

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));


//default option
app.use(fileUpload());

// Static Files
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.use(express.static('upload'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Templating engine
app.set("view engine","hbs");
app.engine('hbs',exphbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
}));


//Define Routes
app.get("/", (req, res)=>{
    res.render("admin/index", {layout: 'landingPage'});
});
// app.use("/auth", require("./routes/auth"));
// app.use("/", require("./routes/pages"));

app.listen(PORT, ()=> console.log(`Listening on Port ${PORT}`));
















