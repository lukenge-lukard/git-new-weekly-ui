const express = require("express");
const authController = require("../controllers/auth");
const { requireAuth  } = require("../middleware/authMiddleware.js");
const router = express.Router();


//          "auth/register"
router.post("/register",  authController.register);

router.post("/login",  authController.login);

router.post("/upload", requireAuth, authController.upload);

router.post("/update", requireAuth, authController.update);

router.post("/editName", requireAuth, authController.editName);

router.post("/editPassword", requireAuth, authController.editPassword);

router.post("/logout", requireAuth, authController.logout);

router.post("/create", requireAuth, authController.create);

router.post("/approve", requireAuth, authController.approve);


module.exports = router;
