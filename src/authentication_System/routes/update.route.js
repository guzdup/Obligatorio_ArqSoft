const express = require('express')
const router = express.Router()

const updateUser = require('../controller/update.controller.js')
const authAdmin = require('../middleware/validateAdmin.js')


router.put('/user/:document', authAdmin, updateUser)

module.exports = router