const jwt = require('jsonwebtoken');
const secretKey = require('../../config');
const User = require('../../authentication_System/modules/user.model');
const Employee = require('../../authentication_System/modules/employee.model');

const authProfessional = async (req, res, next) => {
  console.log("Middleware authProfessional ejecutado")

  var token = req.headers.authorization;
  token = token ? token.replace("Bearer ", "") : null;

  if (!token) {
    return res.status(401).json({ message: 'Autorización denegada. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); 
    const professionalDocument = decoded.document
    
    const professionalFound = await findProfessional(professionalDocument)
    if (!professionalFound || decoded.role != "p") {
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
}

module.exports = authProfessional;