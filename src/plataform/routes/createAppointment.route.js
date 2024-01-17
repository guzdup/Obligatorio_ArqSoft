const express = require('express')
const router = express.Router()

const createAppointment = require('../controller/createAppointment.controller.js')
const authUser = require('../middleware/authUser.js')

router.post('/appointment', authUser, createAppointment)

module.exports = router