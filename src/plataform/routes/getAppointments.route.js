const express = require('express')
const router = express.Router()

const getAppointments = require('../controller/getAppointments.controller.js')
const authAdministrative = require('../middleware/authAdministrative.js')

router.get("/appointment", authAdministrative, getAppointments)

module.exports = router