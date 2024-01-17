const express = require('express')
const router = express.Router()

const readEmployees = require('../controller/readEmployee.controller.js');
const authAdmin = require('../middleware/validateAdmin.js')


router.get('/employees', authAdmin, readEmployees)

module.exports = router