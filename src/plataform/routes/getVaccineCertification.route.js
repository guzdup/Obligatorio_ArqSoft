const express = require('express')
const router = express.Router()

const certification  = require('../controller/getVaccineCertification.controller.js')
const authAdministrator = require('../../authentication_System/middleware/validateAdmin.js');



router.get('/vaccineCertification',authAdministrator,certification)

module.exports = router