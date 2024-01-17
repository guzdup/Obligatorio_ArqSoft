const express = require('express')
const router = express.Router()

const getcheckAppointments = require('../controller/checkAppointments.controller.js')
const authUserAndProfessional = require('../middleware/authUserAndProfessional.js')

router.get('/checkAppointments', authUserAndProfessional, getcheckAppointments)

module.exports = router