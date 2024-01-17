const express = require('express');
const router = express.Router();

const verify = require('../controller/verify.controller.js');

router.get('/verify', verify);

module.exports = router;
