const express = require("express");
const router = express.Router();
const authenticateToken = require("../Middleweres/Auth.middlewere");
const {usercontroller} = require("../Controller/user.controller");

router.get("/",authenticateToken,usercontroller);

module.exports = router;