const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const subscribe = require("../controllers/subscribe"); // subscribe

// USER ROUTE
router.put("/updateUser", userCtrl.updateUser);
router.get("/oneUser", userCtrl.getUser);
router.post("/sendMail", userCtrl.SendEmail);

//
router.post('/', userCtrl.sendRequest);
router.post('/verify', userCtrl.verifyCode);
router.post('/reset', userCtrl.resetPassword);
router.post('/forgotpassword', userCtrl.forgotPassword);
router.post('/checkcode', userCtrl.checkConfirmationCode);
router.post('/reset-password', userCtrl.resetPassword);

// SIGN UP
router.post("/signup", subscribe.signup);
router.post("/login", subscribe.signin);
router.get("/confimation/:id", subscribe.validate);

module.exports = router;
