const express = require('express')
const router = express.Router()
const login = require('../controller/login.controller.js')

router.post('/login', login);

module.exports = router