const jwt = require('jsonwebtoken');
const secretKey = require('../../config.js');
const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Autorizacion denegada" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) { 
            return res.status(401).json({ message: "Token invalido" });
        }
        req.user = decoded;
        console.log(decoded);  
        next();
    })
}

module.exports = authRequired