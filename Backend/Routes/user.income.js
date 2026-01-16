const express = require('express');
const router = express.Router();
const { updateIncome , updateBudget} = require('../Controller/user.controler');
const authenticate = require('../Middleweres/Auth.middlewere');

router.put('/', authenticate, updateIncome);
router.put("/budget",authenticate,updateBudget);
module.exports = router;