const express = require('express')
const router = express.Router()

const certification = require('../controller/certificationVaccine.controller.js')


router.get('/certificate', certification)

module.exports = router