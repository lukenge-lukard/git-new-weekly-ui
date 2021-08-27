const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const conn = require("../db/db.js");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).render("admin/login", {
        message: "Please provide an email and password",
        layout: 'landingPage',
      });
    }
      
      
      conn.query("SELECT * FROM tbl_user WHERE email = ?", [email], async (error, results) => {

          if (!results || !(await bcrypt.compare(password, results[0].password)) ) {
              res.status(401).render("admin/login", {
                message: "Email or Password is Incorrecct",
                layout: 'landingPage',
              });

          } else {
            const id = results[0].user_id;

            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });

            const cookieOptions = {
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };

            res.cookie("jwt", token, cookieOptions);
            res.status(200).redirect("/feed");
          }

      });
   
    
  } catch (error) {
    console.log(error);
  }
        
};

exports.register = (req, res) => {
  const { surname, firstname, email, password, passwordConfirm } = req.body;

  if (!surname || !firstname || !email || !password) {
    return res.status(400).render("admin/register", {
      message: "Please provide name, email and password",
      layout: 'landingPage',
    });
  }

  if ( !passwordConfirm) {
    return res.status(400).render("admin/register", {
      message: "Please re-fill form and comfirm password",
      layout: 'landingPage',
    });
  }

    conn.query(
      "SELECT email FROM tbl_user WHERE email = ?",
      [email],
      async (error, results) => {

        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          return res.render("admin/register", {
            message: "That email is already in use",
            layout: 'landingPage',
          });
        } else if (password !== passwordConfirm) {
          return res.render("admin/register", {
            message: "Passwords do not match",
            layout: 'landingPage',
          });
        }
  
        let hashedPassword = await bcrypt.hash(password, 8);

          conn.query(
            "INSERT INTO tbl_user SET ?",
            { surname: surname, firstname: firstname, email: email, password: hashedPassword },
            (error, results) => {

              if (error) {
                console.log(error);
              } else {
                return res.render("admin/register", {
                  message: "User registered",
                  layout: 'landingPage',
                });
              }
            }
          );

      }
    );

};

exports.upload =  (req, res) => {
  try {
      let sampleFile;
      let uploadPath;
    
      if(!req.files || Object.keys(req.files).length === 0){
          req.session.msg = "No files were uploaded";
          return res.status(400).redirect('/account');
      }
    
      // name of the input is sampleFile
      sampleFile = req.files.sampleFile;
      const imageV2 = sampleFile.data.toString('base64');

      const token = req.cookies.jwt;
      if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
              if (err) {
                  console.log(err);
              } else {           
                  conn.query('UPDATE tbl_user SET profile_photo = ? WHERE user_id = ?', [imageV2, decodedToken.id], (err, rows) => {
                                    
                      if(!err){
                          req.session.msg = "Profile Photo Updated";
                          return res.redirect('/account');                      
                      } else{
                          console.log(err);
                      }
                  });
              }
          });
      } else {
          console.log("No token present");
      }

    
  } catch (error) {
    console.log(error);
  }
};

exports.update = (req, res) => {
  try {
    const token = req.cookies.jwt;
      if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
              if (err) {
                  console.log(err);
              } else { 
                  
                  try {
                
                    const { sex, date, phoneNumber } = req.body;
                    
                    
                    if (!sex && !date && !phoneNumber) { 
                
                          conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                               
                              if(!err){
                                  req.session.msg = "No field filled";
                                  return res.redirect('/account'); 
                              } else{
                                console.log(err);
                              }
                          });
                
                    }
                
                    else if (sex && !date && !phoneNumber) {
                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ sex: sex }, decodedToken.id],
                          (error, results) => {
                            
                            if (error) {
                              console.log(error);
                            } else {                
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                
                                      if(!err){
                                          req.session.msg = "Sex Updated";
                                          return res.status(200).redirect('/account'); 
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                  
                    }
                
                    else if (!sex && date && !phoneNumber) {
                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ date_of_birth: date }, decodedToken.id],
                          (error, results) => {
                
                            if (error) {
                              console.log(error);
                            } else {                
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                     
                                      if(!err){
                                          req.session.msg = "Date Updated";
                                          return res.status(200).redirect('/account');
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                    }
                
                    else if (!sex && !date && phoneNumber) {
                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ phone_number: phoneNumber }, decodedToken.id],
                          (error, results) => {
                
                            if (error) {
                              console.log(error);
                            } else {                 
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                          
                                      if(!err){
                                          req.session.msg = "Phone Number Updated";
                                          return res.status(200).redirect('/account');
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                    }      
                    
                    else if (!sex || !date || !phoneNumber) {                 
                          conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                        
                              if(!err){
                                  req.session.msg = "Fill ALL fields or only ONE in a section and submit";
                                  return res.status(200).redirect('/account');
                              } else{
                                console.log(err);
                              }
                          });
                    } 
                
                    else {
                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ sex: sex, date_of_birth: date, phone_number: phoneNumber }, decodedToken.id],
                          (error, results) => {
                
                            if (error) {
                              console.log(error);
                            } else {               
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                       
                                      if(!err){
                                          req.session.msg = "Profile Updated";
                                          return res.status(200).redirect('/account');
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                    } 
                    
                  } catch (error) {
                    console.log(error);
                  }
                  
              }
          });
      } else {
          console.log("No token present");
      } 
    
  } catch (error) {
    console.log(error);
  }

};

exports.editName = (req, res) => {
  try {
    const token = req.cookies.jwt;
      if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
              if (err) {
                  console.log(err);
              } else { 
                  
                  try {
                
                    const { surname, firstname, username } = req.body;
                    
                    if (!surname && !firstname && !username) {  

                          conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                              
                              if(!err){
                                  req.session.msg = "No field filled";
                                  return res.status(400).redirect('/account');
                              } else{
                                console.log(err);
                              }
                          });
                    }
                
                    else if (surname && !firstname && !username) {
                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ surname: surname }, decodedToken.id],
                          (error, results) => {
                            
                            if (error) {
                              console.log(error);
                            } else {               
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                       
                                      if(!err){
                                          req.session.msg = "Surname Updated";
                                          return res.status(200).redirect('/account');
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                  
                    }
                
                    else if (!surname && firstname && !username) {                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ firstname: firstname }, decodedToken.id],
                          (error, results) => {
                
                            if (error) {
                              console.log(error);
                            } else {                
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                        
                                      if(!err){
                                          req.session.msg = "First Name Updated";
                                          return res.status(200).redirect('/account');
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                    }
                
                    else if (!surname && !firstname && username) {                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ username: username }, decodedToken.id],
                          (error, results) => {
                
                            if (error) {
                              console.log(error);
                            } else {                 
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                       
                                      if(!err){
                                          req.session.msg = "Username Updated";
                                          return res.status(200).redirect('/account');
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                    }      
                    
                    else if (!surname || !firstname || !username) {                 
                          conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                             
                              if(!err){
                                  req.session.msg = "Fill ALL fields or only ONE in a section and submit";
                                  return res.status(400).redirect('/account');
                              } else{
                                console.log(err);
                              }
                          });
                    } 
                
                    else {
                
                      console.log("Input Only: All fields entered!");
                  
                        conn.query(
                          "UPDATE tbl_user SET ? WHERE user_id = ?",
                          [{ surname: surname, firstname: firstname, username: username }, decodedToken.id],
                          (error, results) => {
                
                            if (error) {
                              console.log(error);
                            } else {                
                                  conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                          
                                      if(!err){
                                          req.session.msg = "Profile Updated";
                                          return res.status(200).redirect('/account');
                                      } else{
                                        console.log(err);
                                      }
                                  });
                            }
                          }
                        );
                    } 
                    
                  } catch (error) {
                    console.log(error);
                  }
                  

              }
          });
      } else {
          console.log("No token present");
      }   
    
  } catch (error) {
    console.log(error);
  }

};

exports.editPassword = (req, res) => {
  try {
    const token = req.cookies.jwt;
      if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
              if (err) {
                  console.log(err);
              } else {  
                  
                  try {
                
                    const { currentPassword, newPassword, confirmPassword } = req.body
                    
                    if (!currentPassword || !newPassword || !confirmPassword) {
                                
                          conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                
                              if(!err){
                                  req.session.msg = "Please fill all the password fields.";
                                  return res.status(400).redirect('/account');
                              } else{
                                console.log(err);
                              }
                          });
                      
                    } 
                
                    else if (newPassword !== confirmPassword) {                  
                          conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                            
                              if(!err){
                                  req.session.msg = "New Passwords do not match";
                                  return res.status(401).redirect('/account');
                              } else{
                                console.log(err);
                              }
                          });
                    }
                    
                    else {
                        
                        conn.query(
                          "SELECT * FROM tbl_user WHERE user_id = ?",
                          [decodedToken.id],
                          async (error, results) => {
                            
                            if (
                              !results ||
                              !(await bcrypt.compare(currentPassword, results[0].password))
                              ) {

                                    conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                        
                                        if(!err){
                                            req.session.msg = "Password is Incorrect";
                                            return res.status(401).redirect('/account');
                                        } else{
                                          console.log(err);
                                        }
                                    });

                              } else {
                  
                                  let hashedPassword = await bcrypt.hash(newPassword, 8);
                                  console.log(hashedPassword);
                              
                                    conn.query(
                                      "UPDATE tbl_user SET ? WHERE user_id = ?",
                                      [{ password: hashedPassword }, decodedToken.id],
                                      (error, results) => {
                                        
                                        if (error) {
                                          console.log(error);
                                        } else {                 
                                              conn.query("SELECT * FROM tbl_user WHERE user_id = ?",[decodedToken.id], (err, rows) => {
                                                               
                                                  if(!err){
                                                      req.session.msg = "Password Changed";
                                                      return res.status(200).redirect('/account');
                                                  } else{
                                                    console.log(err);
                                                  }
                                              });
                                        }
                                      }
                                    );        
                                }
                        });
                    }
                     
                  } catch (error) {
                    console.log(error);
                  }
                  
              }
          });
      } else {
          console.log("No token present");
      }   
    
  } catch (error) {
    console.log(error);
  }
};

exports.logout = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
          if (err) {
              console.log(err);
          } else { 

              res.clearCookie("jwt");
              return res.redirect('/login');              
              
          }
      });
  } else {
      console.log("No token present");
  }   
};

exports.approve = (req, res) => {
  const { id } = req.body;

    conn.query('UPDATE tbl_post SET post_approval = ? WHERE post_id = ?', [1, id], (err, rows) => {          
        if(!err){
            return res.redirect('/editor');                      
        } else{
            console.log(err);
        }
    });

};

exports.create = (req, res) => {
  try {
    const token = req.cookies.jwt;
      if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
              if (err) {
                  console.log(err);
              } else {
                  
                  try {
                
                    const { date, title, paragraph, category } = req.body;
                
                    let coverPhoto;
                    let uploadPath;
                    // name of the input is coverPhoto
                    coverPhoto = req.files.coverPhoto;
                    
                    
                    if ( date && title && paragraph && category ) {
                
                      if(!req.files || Object.keys(req.files).length === 0){
                          req.session.msg = "No files were uploaded";
                          return res.status(400).redirect('/create');
                      }
                      
                      const image = coverPhoto.data.toString('base64');
                
                      conn.query("INSERT INTO tbl_post SET ?", { post_title: title, post_date: date}, (postError, postResults) => {
                          if (postError) {console.log(postError);} else {

                            
                            conn.query("SELECT * FROM tbl_post_category WHERE post_category = ?", [category],  (categoryError, categoryResults) => {
                              if (categoryError) {console.log(categoryError);} else {

                                conn.query("INSERT INTO tbl_post_vs_category SET ?", { post_id: postResults.insertId, post_category_id: categoryResults[0].post_category_id }, (pvcError, pvcResults) => {
                                  if(pvcError){console.log(pvcError);} else{
    
                                    conn.query("INSERT INTO tbl_user_vs_post SET ?", { user_id: decodedToken.id, post_id: postResults.insertId}, (error, results) => {
                                      if(error){console.log(error);} else{

                                        conn.query("INSERT INTO tbl_post_paragraphs SET ?", { paragraph: paragraph,  post_id: postResults.insertId}, (paraError, paragraphResult) => {
                                          if(paraError){console.log(paraError);}else {
                                            conn.query("INSERT INTO tbl_image SET ?", { image_file: image,  post_id: postResults.insertId}, (imgError, imgResult) => {
                        
                                              req.session.msg = "New Post Created";
                                              return res.redirect("/create");
                        
                                            });
                                          }
                                        });
                                      }
                                    });
    
    
                                  }
                                });


                              }
                            });


                          }
                      });   
                
                    } else {
                      req.session.msg = "Please fill all fields";
                      return res.redirect("/create");
                    }              
     
                  } catch (error) {
                    console.log(error);
                  }
      
              }
          });
      } else {
          console.log("No token present");
      }   
    
  } catch (error) {
    console.log(error);
  }
};
