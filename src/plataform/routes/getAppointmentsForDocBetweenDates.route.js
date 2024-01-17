const express = require('express')
const router = express.Router()

const getAppointmentsForDocBetweenDates = require('../controller/getAppointmentsForDocBetweenDates.Controller.js')
const authUser = require('../middleware/authUser.js')

router.get('/appointmentsFilteredBetweenDates', authUser, getAppointmentsForDocBetweenDates)

module.exports = router