const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleweres/Auth.middlewere");
const {createSubscription , getSubscriptions , toggleSubscriptionStatus} = require("../Controller/subscription.controller");

router.post("/", authMiddleware,createSubscription);
router.get("/", authMiddleware,getSubscriptions);
router.patch("/:id/toggle", authMiddleware,toggleSubscriptionStatus);

module.exports = router;