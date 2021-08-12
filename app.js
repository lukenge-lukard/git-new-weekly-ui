const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./env" });

const {
    PORT = 5002
} = process.env;

const app = express();

app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, ()=> console.log(`Listening on Port ${PORT}`));