const express = require('express')
const router = express.Router()
const logout = require('../controller/logout.controller.js')

router.post('/logout', logout);

module.exports = router