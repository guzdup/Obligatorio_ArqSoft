const User = require("../modules/user.model");
const bcrypt = require('bcrypt');
const createAccessToken = require('../libs/jwt.js')
const {userVerified} = require('../validation/userValidations.js')

const userNotVerified = "El usuario no se encuentra verificado"

const login = async (req, res) => {
    const { document, password } = req.body;
    
    try {
        
        const userFound = await User.findOne({ documentID: document })
        
        if(!userFound){
            return res.status(400).json({message: "Documento o contraseña incorrectos"})
        }
        
        let isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch){
            return res.status(400).json({message: "Documento o contraseña incorrectos"})
        }
        
        if(!await userVerified(userFound, res)){
            res.status(400).json({ error: userNotVerified })
        }

        const token = await createAccessToken({ document: userFound.documentID, role:userFound.role })
        res.cookie("token", token)

        res.json({
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            document: userFound.documentID,
            email: userFound.email,
            telephone: userFound.telephone,
            dateOfBirth: userFound.dateOfBirth 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al loguear usuario", message: error.message});
    }
}

module.exports = login