const express = require('express')
const router = express.Router()

const shedules = require('../controller/createSheduleForVaccination.controller.js')
const authUser = require('../middleware/authUser.js')


router.post('/sheduleVaccine', authUser, shedules)

module.exports = router