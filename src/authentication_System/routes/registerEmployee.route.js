const express = require('express')
const router = express.Router()

const register = require('../controller/registerEmployee.controller.js')
const authAdmin = require('../middleware/validateAdmin.js')


router.post('/register/employee', authAdmin, register)

module.exports = router