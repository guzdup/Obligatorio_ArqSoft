const express = require('express')
const router = express.Router()

const {User} = require('../modules/user.model.js')
const { register, multerMiddleware } = require('../controller/register.controller.js');
const authAdmin = require('../middleware/validateAdmin.js')

router.post('/register', authAdmin, register)

module.exports = router