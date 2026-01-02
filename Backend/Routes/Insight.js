const express = require("express");
const router = express.Router();
const { insightrout } = require("../Controller/insightcontroller"); 
const authMiddleware = require("../Middleweres/Auth.middlewere");


router.get("/", authMiddleware, insightrout);

module.exports = router;