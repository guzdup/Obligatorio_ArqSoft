const express = require('express')
const router = express.Router()

const getcheckUserAppointments = require('../controller/checkUserAppointments.controller.js')
const authUser = require('../middleware/authUser.js')

router.get('/checkUserAppointments', authUser, getcheckUserAppointments)

module.exports = router