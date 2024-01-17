const { Router } = require("express");
const profile = require('../controller/profile.controller.js')
const authRequired = require('../middleware/validateToken.js')

const router = Router()


router.get('/profile', authRequired, profile);

module.exports = router