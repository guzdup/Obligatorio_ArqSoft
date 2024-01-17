const jwt = require('jsonwebtoken');
const secretKey = require('../../config');
const User = require('../../authentication_System/modules/user.model');

const authUser = (req, res, next) => {
  console.log("Middleware authUser ejecutado")

  var token = req.headers.authorization;
  token = token ? token.replace("Bearer ", "") : null;
  
  if (!token) {
    return res.status(401).json({ message: 'Autorización denegada. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); 
    userDocument = decoded.document
    if(!findUser(userDocument)){
        res.status(403).json({message: "No tiene permiso para hacer esta accion"})
    }

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

function findUser(userDocument){
    return User.findOne({ documentID: userDocument})
}

module.exports = authUser;