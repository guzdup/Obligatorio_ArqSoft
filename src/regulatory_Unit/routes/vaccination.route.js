const express = require('express')
const router = express.Router()

const vaccination = require('../controller/vaccination.controller.js')


router.post('/register/vaccine', vaccination)

module.exports = router