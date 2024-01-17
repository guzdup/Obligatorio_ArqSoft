const express = require('express')
const router = express.Router()

const addNoteToAppointment = require('../controller/addNoteToAppointment.controller.js')
const authProfessional = require('../middleware/authProfessional.js')

router.post('/appointmentAddNote', authProfessional, addNoteToAppointment)

module.exports = router