const express = require('express')
const router = express.Router()

const getAppointmentsByDateAndDoc = require('../controller/getAppsByDateAndDoc.controller.js')
const authProfessional = require('../middleware/authProfessional.js')

router.get('/appointmentsFiltered', authProfessional, getAppointmentsByDateAndDoc)

module.exports = router