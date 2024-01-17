const User = require("../modules/user.model");

const profile = async (req, res) => {
    const userFound = await User.findOne({ documentID: req.user.document })

    if (!userFound) {
        return res.status(400).json({ message: "Usuario no encontrado" });
    }
    
    return res.json({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        document: newUser.documentID,
        email: newUser.email,
        telephone: newUser.telephone,
        dateOfBirth: newUser.dateOfBirth
    })
}

module.exports = profile