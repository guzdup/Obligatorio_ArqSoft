const express = require('express')
const router = express.Router()
const authAdministrator = require('../../authentication_System/middleware/validateAdmin.js');

const vacccineAdmin = require('../controller/vaccineAdministration.controller.js')


router.post('/vaccineAdministration', authAdministrator, vacccineAdmin)

module.exports = router