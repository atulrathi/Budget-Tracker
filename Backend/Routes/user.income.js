const express = require('express');
const router = express.Router();
const { updateIncome } = require('../Controller/user.controler');
const authenticate = require('../Middleweres/Auth.middlewere');

router.put('/', authenticate, updateIncome);

module.exports = router;