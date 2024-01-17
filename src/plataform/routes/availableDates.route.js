const express = require('express')
const router = express.Router()

const availableDates = require('../controller/availableDates.controller.js')


router.get('/availableDates', availableDates)

module.exports = router