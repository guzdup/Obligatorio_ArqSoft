const express = require('express')
const router = express.Router()

const deleteEmployee = require('../controller/deleteEmployee.controller.js');
const authAdmin = require('../middleware/validateAdmin.js')


router.delete('/employees', authAdmin, deleteEmployee)

module.exports = router