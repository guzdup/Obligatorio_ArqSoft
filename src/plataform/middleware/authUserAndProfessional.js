const jwt = require('jsonwebtoken');
const secretKey = require('../../config');
const User = require('../../authentication_System/modules/user.model');
const Employee = require('../../authentication_System/modules/employee.model');

const authUserAndProfessional = async (req, res, next) => {
  console.log("Middleware authUserAndProfessional ejecutado")

  var token = req.headers.authorization;
  token = token ? token.replace("Bearer ", "") : null;

  if (!token) {
    return res.status(401).json({ message: 'Autorización denegada. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const documentID = decoded.document

    const professionalFound = await findProfessional(documentID)
    const userFound = await findUser(documentID)
    if (!userFound && (!professionalFound || decoded.role != "p")) {
      return res.status(403).json({ message: "No tiene permiso para hacer esta accion" })
    }
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

async function findProfessional(userDocument) {
  return Employee.findOne({ documentID: userDocument })
};

function findUser(userDocument){
    return User.findOne({ documentID: userDocument})
};

module.exports = authUserAndProfessional;