const secretKey = require('../../config');
const jwt = require('jsonwebtoken')

const authAdministrative = (req, res, next) => {
    var token = req.headers.authorization;
    token = token ? token.replace("Bearer ", "") : null;

    if (!token) {
        return res.status(401).json({ message: 'Autorización denegada. Token no proporcionado.' });
    }
    try {
        const decoded = jwt.verify(token, secretKey); 
        if (decoded.role !== 'a') {
            return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.', error: error.message });
    }
}

module.exports = authAdministrative