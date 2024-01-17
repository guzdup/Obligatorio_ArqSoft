const express = require('express')
const router = express.Router()

const vaccinationHistory = require('../controller/vaccinationHistory.controller.js')


router.get('/vaccinationHistory', vaccinationHistory)

module.exports = router