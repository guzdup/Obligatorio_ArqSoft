const User = require("../modules/user.model.js");
const bcrypt = require('bcrypt');
const createAccessToken = require('../libs/jwt.js')

const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    })
    res.status(200).json({ message: "Usuario deslogueado" });
}

module.exports = logout