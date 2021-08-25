const express = require("express");
const mysql = require("mysql8");
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require("path");
const conn = require("../db/db.js");
const { requireAuth, checkUser,  } = require("../middleware/authMiddleware.js");


// let user_email;
var data = fs.readFileSync('words.json');
var words = JSON.parse(data);

// admin routes
// router.get("*", checkUser);
router.get("/", (req, res)=>{
    res.render("admin/index", {layout: 'landingPage'});
});
router.get("/login",  (req, res)=>{
    res.render("admin/login", {layout: 'landingPage'});
});
router.get("/register",  (req, res)=>{
    res.render("admin/register", {layout: 'landingPage'});
});

// Side bar link routers
router.get("/account", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        var msg = req.session.msg;
                        req.session.msg = null; 
                        res.render("maintabs/user-account", {
                            layout: 'accounts',
                            message: msg ? msg : null,
                            rows
                        });
                    } else{
                        console.log(err);
                    }
                });
            }
        });
    } else {
        console.log("No token present");
    }
    

});

router.get("/feed", requireAuth,  (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {           
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        return res.render("maintabs/dashboard", {layout: 'tabs', rows});
                    } else{
                        console.log(err);
                    }
                });            
            }
        });
    } else {
        console.log("No token present");
    }   
});

router.get("/create", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {          
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        conn.query("SELECT po.post_title, po.post_date, pa.paragraph, u.surname, u.firstname, u.profile_photo FROM tbl_post po JOIN tbl_post_paragraphs pa ON po.post_id = pa.post_id JOIN tbl_user_vs_post uvp ON po.post_id = uvp.post_id JOIN tbl_user u ON uvp.user_id = u.user_id ORDER BY po.post_id DESC", (err, results) => {
                            if(!err){
                                console.log(results);
                                function nl2br(str){
                                    return str.trim().replace(/(?:\r\n|\r|\n)/g, '\n\n');
                                }
            
                                for(let i = 0; i < results.length; i++){
                                    results[i].paragraph = nl2br(results[i].paragraph);
                                }
            
                                var msg = req.session.msg;
                                req.session.msg = null; 
                                return res.render("maintabs/create", {
                                    layout: 'create',
                                    message: msg ? msg : null,
                                    rows,
                                    results
                                });
                            } else {
                                console.log(err);
                            }
            
                        });
                    } else{
                        console.log(err);
                    }
                });
            }
        });
    } else {
        console.log("No token present");
    } 
});

router.get("/page-under-devt", (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        res.render("admin/page-under-devt", {layout: 'page-devt', rows});
                    } else{
                        console.log(err);
                    }
                });
            }
        });
    } else {
        console.log("No token present");
    } 
});

//Main Tabs Scrollable on top
router.get("/campus-101", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        return res.render("maintabs/campus-101", {layout: 'tabs', rows});
                    } else{
                        console.log(err);
                    }
                });    
            }
        });
    } else {
        console.log("No token present");
    }
});

router.get("/interview", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        return res.render("maintabs/interview", {layout: 'tabs', rows});
                    } else{
                        console.log(err);
                    }
                });    
            }
        });
    } else {
        console.log("No token present");
    }
});

router.get("/internship", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        return res.render("maintabs/internship", {layout: 'tabs', rows});
                    } else{
                        console.log(err);
                    }
                });    
            }
        });
    } else {
        console.log("No token present");
    }
});

router.get("/noticeboard", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        return res.render("maintabs/noticeboard", {layout: 'tabs', rows});
                    } else{
                        console.log(err);
                    }
                });    
            }
        });
    } else {
        console.log("No token present");
    }
});

router.get("/inspiration", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        return res.render("maintabs/inspiration", {layout: 'tabs', rows});
                    } else{
                        console.log(err);
                    }
                });    
            }
        });
    } else {
        console.log("No token present");
    }
});

router.get("/uncensored", requireAuth, (req, res)=>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {            
                conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                    if(!err){
                        return res.render("maintabs/uncensored", {layout: 'tabs', rows});
                    } else{
                        console.log(err);
                    }
                });    
            }
        });
    } else {
        console.log("No token present");
    }
});

    conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[words.userId], (err, rows) => {
       
        
        if(!err){ 


            router.get("/team", (req, res)=>{
                res.render("maintabs/team", {rows});
            });

            // new story file routes
            router.get("/cry-of-african-child-poem", (req, res)=>{
                res.render("cry-of-african-child-poem", {rows});
            });
            router.get("/african-child-by-binepe", (req, res)=>{
                res.render("african-child-by-binepe", {rows});
            });            
            router.get("/they-are-back", (req, res)=>{
                res.render("they-are-back", {rows});
            });
            router.get("/lifestyle", (req, res)=>{
                res.render("debate", {rows});
            });
            router.get("/ldc-guild-president-interview", (req, res)=>{
                res.render("ldc-guild-president-interview", {rows});
            });
            router.get("/midwifery-internship", (req, res)=>{
                res.render("midwifery-internship", {rows});
            });
            router.get("/graduation", (req, res)=>{
                res.render("graduation", {rows});
            });
            router.get("/powerless", (req, res)=>{
                res.render("powerless", {rows});
            });
            router.get("/chief-fresher-debate", (req, res)=>{
                res.render("chief-fresher-debate", {rows});
            });
            router.get("/she-won", (req, res)=>{
                res.render("she-won", {rows});
            });
            router.get("/money", (req, res)=>{
                res.render("money", {rows});
            });
            router.get("/student-midwives", (req, res)=>{
                res.render("student-midwives", {rows});
            });
            router.get("/mental-health-awareness", (req, res)=>{
                res.render("mental-health-awareness", {rows});
            });
            router.get("/LDC-guild-swearing-in", (req, res)=>{
                res.render("LDC-guild-swearing-in", {rows});
            });
            router.get("/saturday-1-may-2021", (req, res)=>{
                res.render("saturday-1-may-2021", {rows});
            });
            router.get("/saturday-8-may-2021", (req, res)=>{
                res.render("saturday-8-may-2021", {rows});
            });
            router.get("/check-on-your-friends", (req, res)=>{
                res.render("check-on-your-friends", {rows});
            });
            router.get("/tied-and-ready", (req, res)=>{
                res.render("tied-and-ready", {rows});
            });
            router.get("/food-and-restaurants", (req, res)=>{
                res.render("food-and-restaurants", {rows});
            });
            router.get("/my-decision", (req, res)=>{
                res.render("my-decision", {rows});
            });
            router.get("/climate-change", (req, res)=>{
                res.render("climate-change", {rows});
            });
            router.get("/saturday-12-june-2021", (req, res)=>{
                res.render("saturday-12-june-2021", {rows});
            });
            router.get("/saturday-19-june-2021", (req, res)=>{
                res.render("saturday-19-june-2021", {rows});
            });
            router.get("/interview-with-mr-bwambale", (req, res)=>{
                res.render("interview-with-mr-bwambale", {rows});
            });

            // Once done, release connection
            // connection.release();

        } else {
            console.log(err);
        }

    });


module.exports = router;