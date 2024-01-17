const User = require('../modules/user.model.js'); 
const bcrypt = require('bcrypt'); 

const updateUser = async (req, res) => {
  const documentID = req.params.document; 
  const {firstName, lastName, email, address, telephone, password} = req.body; 
  
  try {

        const existingUser = await User.findOne({documentID: documentID});

        if (!existingUser) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if(!existingUser.validate){
          return res.status(400).json({ error: 'El Usuario no fue validado' });
        }

        if (firstName) {
          existingUser.firstName = firstName;
        }

        if (lastName) {
          existingUser.lastName = lastName;
        }

        if (email) {
          const existingEmail = await User.findOne({email: email})
          if(existingEmail){
            return res.status(400).json({ error: 'El email ya existe' });
          }
          existingUser.email = email;
        }

        if (address) {
          existingUser.address = address;
        }

        if (telephone) {
          existingUser.telephone = telephone;
        }

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUser.password = hashedPassword;
        }

        const updatedUser = await existingUser.save();

        res.json({
          message: "Usuario actualizado",
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          document: updatedUser.documentID,
          email: updatedUser.email,
          telephone: updatedUser.telephone,
          dateOfBirth: updatedUser.dateOfBirth, 
    });
  } 
  catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario', message: error.message });
  }
};

module.exports = updateUser;
